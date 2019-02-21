const low = require('lowdb')
const puppeteer = require('puppeteer')
const FileSync = require('lowdb/adapters/FileSync')
const schedule = require('node-schedule')

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ waits: [] }).write()

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const isEmpty = v => v === '0:00'

const main = async isRetrying => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto('https://www.dmv.ca.gov/portal/dmv/detail/fo/offices/fieldoffice?number=645')

  const waits = await page.evaluate(() =>
    [...document.getElementById('WaitTimesData').children].map(o => o.children[1].innerText),
  )

  if (!waits[0] || !waits[1]) {
    if (!isRetrying) {
      await sleep(500)
      main(true)
    }

    return
  }

  if (isEmpty(waits[0]) && isEmpty(waits[1])) {
    const last = db
      .get('waits')
      .takeRight(1)
      .value()[0]

    if (isEmpty(last.withApt) && isEmpty(last.withoutApt)) {
      return
    }
  }

  const time = Date.now()

  db
    .get('waits')
    .push({ time, withApt: waits[0], withoutApt: waits[1] })
    .write()

  await browser.close()
}

schedule.scheduleJob('*/5 * * * *', main)
