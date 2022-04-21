import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'

function LineChart({ chartData }) {
  return <Line data={chartData}
    options={{
      scales: {
        y:
        {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        },
      }
    }
    } />
}

export default LineChart