import React from 'react'
import ReactDOM from 'react-dom'
import { format } from 'date-fns'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'

import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'

import rawData from '../db.json'

const officesMap = {
  503: 'San Francisco',
  599: 'Daily City',
  645: 'San Jose DLPC',
}

const data = rawData.waits.filter(({ withApt, withoutApt }) => withApt || withoutApt)

const toMinutes = text => {
  const [hours, minutes] = text.split(':')
  return Number(hours) * 60 + Number(minutes)
}

const toHuman = num => {
  const hours = num / 60
  const rhours = Math.floor(hours)
  const minutes = (hours - rhours) * 60
  const rminutes = Math.round(minutes)
  return `${rhours ? `${rhours}h` : ''}${rminutes ? `${rminutes}m` : ''}`
}

const App = () => {
  return (
    <div className="App" style={{ fontFamily: 'monospace' }}>
      {Object.keys(officesMap).map(id => {
        const officeData = data.filter(d => Number(d.id) === Number(id))

        return (
          <div key={id}>
            <h4>{officesMap[id]}</h4>

            <ReactEchartsCore
              echarts={echarts}
              option={{
                tooltip: {
                  trigger: 'axis',
                  formatter: params => {
                    return `
                ${format(Number(params[0].axisValue), 'HH:mm dddd DD/MM/YY')}
                <br />
                ${params
                  .map(
                    (p, i) => `
                  ${p.marker} ${i === 0 ? 'With appointment' : 'Without appointment'} ${toHuman(
                      p.value,
                    )}
                `,
                  )
                  .join('<br />')}
              `
                  },
                },
                xAxis: {
                  type: 'category',
                  data: officeData.map(d => d.time),
                  axisLabel: {
                    formatter: v => format(Number(v), 'DD ddd'),
                  },
                },
                yAxis: {
                  type: 'value',
                  axisLabel: {
                    formatter: v => toHuman(v),
                  },
                },
                series: [
                  {
                    data: officeData.map(d => toMinutes(d.withApt)),
                    type: 'line',
                  },

                  {
                    data: officeData.map(d => toMinutes(d.withoutApt)),
                    type: 'line',
                  },
                ],
              }}
              notMerge
              lazyUpdate
            />
          </div>
        )
      })}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

if (module.hot) {
  module.hot.accept()
}
