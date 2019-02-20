const low = require('lowdb')
const puppeteer = require('puppeteer')
const FileSync = require('lowdb/adapters/FileSync')
const schedule = require('node-schedule')

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ waits: [] }).write()

const main = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto('https://www.dmv.ca.gov/portal/dmv/detail/fo/offices/fieldoffice?number=645')

  const waits = await page.evaluate(() =>
    [...document.getElementById('WaitTimesData').children].map(o => o.children[1].innerText),
  )

  const time = Date.now()

  db
    .get('waits')
    .push({ time, withApt: waits[0], withoutApt: waits[1] })
    .write()

  await browser.close()
}

schedule.scheduleJob('*/5 * * * *', main)
