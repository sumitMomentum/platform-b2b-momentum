"use client"
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { DashboardAccessOut } from 'svix';
import { BarChart } from "@mui/x-charts/BarChart";
import { Average } from 'next/font/google';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const AvgDistanceChart = ({dashboardData}) => {
  const arrayOfArrays = dashboardData.monthlyUsage;
  // const [loading, setLoading] = useState(true);
  
  const randomNumber = Math.floor(Math.random() * 11);

  const [series, setSeries] = useState([
    {
      label: "Average Distance (kms)",
      data: arrayOfArrays,
    },
  ]);
  const xLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <BarChart
      width={700}
      height={300}
      series={series}
      xAxis={[{ data: xLabels, scaleType: "band" }]}
    />
  );
};

// const AvgDistanceChart = ({dashboardData}) => {
//   const arrayOfArrays = dashboardData.MonthlyUsage;
//   // const [loading, setLoading] = useState(true);

//   const randomNumber = Math.floor(Math.random() * 11);

//   const [options] = useState({
//     xaxis: {
//       categories: [
//         'Jan',
//         'Feb',
//         'Mar',
//         'Apr',
//         'May',
//         'Jun',
//         'Jul',
//         'Aug',
//         'Sep',
//         'Oct',
//         'Nov',
//         'Dec',
//       ],
//     },
//     yaxis: {
//       labels: {
//         formatter: function (value: number) {
//           return value + ' km';
//         },
//       },
//     },
//   });

//   const [series] = useState([
//     {
//       name: 'Vehicle 1',
//       data: arrayOfArrays,
//     },
//   ]);

//   return (
//     <div className="app">
//       <div className="row">
//         <div className="flex justify-center items-center mixed-chart">
//           <Chart
//             options={options}
//             series={series}
//             type="bar"
//             width="735"
//             height="180"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };
export default AvgDistanceChart;
