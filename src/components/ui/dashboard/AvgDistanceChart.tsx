"use client"
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { DashboardAccessOut } from 'svix';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const AvgDistanceChart = ({dashboardData}) => {
  const arrayOfArrays = dashboardData.MonthlyUsage;

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
      data: arrayOfArrays,
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
