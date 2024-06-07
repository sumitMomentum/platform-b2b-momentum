"use client"
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const DistanceTravelledChart = () => {
  const [options] = useState({
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    yaxis: {
      labels: {
        formatter: function (value: number) {
          return value + ' km';
        },
      },
    },
  });

  const [series] = useState([
    {
      name: 'Vehicle 1',
      data: [30, 40, 45, 50, 49, 60, 70, 91, 88, 99, 87, 77],
    },
    {
      name: 'Vehicle 2',
      data: [60, 70, 91, 88, 99, 87, 77, 30, 40, 45, 50, 49],
    },
    {
      name: 'Vehicle 3',
      data: [35, 67, 34, 56, 45, 56, 78, 89, 65, 76, 54, 66],
    },
    // {
    //   name: 'Vehicle 4',
    //   data: [30, 40, 45, 50, 49, 60, 70, 91, 88, 99, 87, 77],
    // },
  ]);

  return (
    <div className="app">
      <div className="row">
        <div className="flex justify-center items-center mixed-chart">
          <Chart
            options={options}
            series={series}
            type="bar"
            width="735"
            height="250"
          />
        </div>
      </div>
    </div>
  );
};

export default DistanceTravelledChart;
