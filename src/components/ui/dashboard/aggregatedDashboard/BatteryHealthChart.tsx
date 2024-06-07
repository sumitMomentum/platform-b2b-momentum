"use client"
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const BatteryHealthChart = () => {
  const [options] = useState({
    chart: {
      id: 'basic-bar',
    },
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
          return value + ' %';
        },
      },
    },
  });

  const [series] = useState([
    {
      name: 'vehicle 1',
      data: [
        99, 98.7, 97.9, 97.7, 97.2, 96.8, 95.5, 94.7, 93.9, 94.0, 93.6, 93.4,
      ],
    },
    {
      name: 'vehicle 2',
      data: [
        93, 94.7, 96.9, 95.7, 94.2, 93.8, 96.5, 97.7, 98.9, 98.0, 97.6, 97.4,
      ],
    },
    {
      name: 'vehicle 3',
      data: [97, 94, 95, 95, 94, 92, 90, 89, 88, 87, 86, 85],
    },
    
  ]);

  return (
    <div className="app">
      <div className="row">
        <div className="flex justify-center items-centermixed-chart">
          <Chart
            options={options}
            series={series}
            type="line"
            width="735"
            height="250"
          />
        </div>
      </div>
    </div>
  );
};

export default BatteryHealthChart;
