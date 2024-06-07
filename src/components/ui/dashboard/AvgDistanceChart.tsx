"use client"
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const AvgDistanceChart = () => {
  const arrayOfArrays = [
    [45, 90, 135, 110, 55, 70, 130, 75, 40, 140, 95, 120],
    [140, 70, 90, 50, 130, 40, 100, 60, 110, 145, 35, 75],
    [40, 120, 95, 50, 80, 35, 150, 70, 125, 130, 105, 45],
    [60, 80, 110, 35, 90, 145, 140, 75, 130, 100, 120, 50],
    [125, 60, 35, 80, 130, 110, 40, 90, 140, 55, 95, 150],
    [50, 120, 70, 90, 35, 100, 130, 145, 55, 75, 140, 110],
    [70, 110, 95, 40, 80, 135, 50, 125, 140, 60, 30, 120],
    [110, 35, 130, 50, 70, 140, 120, 45, 80, 145, 90, 100],
    [75, 110, 50, 120, 35, 95, 140, 60, 80, 100, 130, 145],
    [50, 90, 130, 35, 80, 110, 75, 100, 140, 120, 60, 145]
  ];

  const randomNumber = Math.floor(Math.random() * 11);

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
      data: arrayOfArrays[randomNumber],
    },
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
            height="180"
          />
        </div>
      </div>
    </div>
  );
};

export default AvgDistanceChart;
