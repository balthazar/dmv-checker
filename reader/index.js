import React from 'react'
import ReactDOM from 'react-dom'
import { ResponsiveLine } from '@nivo/line'
import { format } from 'date-fns'

import rawData from '../db.json'

const data = rawData.waits.filter(({ withApt, withoutApt }) => withApt || withoutApt)

const toMinutes = text => {
  const [hours, minutes] = text.split(':')
  return Number(hours) * 60 + Number(minutes)
}

const App = () => (
  <div className="App">
    <ResponsiveLine
      data={[
        {
          id: 'With appointment',
          color: 'red',
          data: data.map(({ time, withApt }) => ({ x: time, y: toMinutes(withApt) })),
        },
        {
          id: 'Without appointment',
          color: 'blue',
          data: data.map(({ time, withoutApt }) => ({ x: time, y: toMinutes(withoutApt) })),
        },
      ]}
      margin={{
        top: 50,
        right: 150,
        bottom: 50,
        left: 60,
      }}
      tooltip={o => {
        return (
          <div style={{ fontFamily: 'monospace' }}>
            {format(o.id, 'HH:mm ddd')}
            <div>
              {o.data.map(e => (
                <div key={e.serie.id} style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: 5,
                      backgroundColor: e.serie.color,
                    }}
                  />
                  <span style={{ marginRight: 5, marginLeft: 5 }}>
                    {e.serie.id}
                    {': '}
                  </span>
                  <span>
                    {e.data.y}
                    {'m'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      }}
      axisBottom={null}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'wait time (minutes)',
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      dotSize={10}
      dotColor="inherit:darker(0.3)"
      dotBorderWidth={2}
      dotBorderColor="#ffffff"
      enableDotLabel={true}
      dotLabel="y"
      dotLabelYOffset={-12}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))

if (module.hot) {
  module.hot.accept()
}
