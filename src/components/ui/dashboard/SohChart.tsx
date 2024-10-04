"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { LineChart } from "@mui/x-charts/LineChart";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SohChart = ({ dashboardData }) => {
  const sohArray = dashboardData.soh;
  console.log(dashboardData.soh);
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

  const [series] = useState([
    {
      label: "SoH (%)",
      data: sohArray,
    },
  ]);

  return (
    <LineChart
      width={700}
      height={300}
      series={series}
      xAxis={[{ scaleType: "point", data: xLabels }]}
    />
  );
};

export default SohChart;

// const SohChart = ({dashboardData}) => {
//   const sohArray = dashboardData.soh

//   const [options] = useState({
//     chart: {
//       id: "basic-bar",
//     },
//     xaxis: {
//       categories: [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//       ],
//     },
//     yaxis: {
//       labels: {
//         formatter: function (value: number) {
//           return value + " %";
//         },
//       },
//     },
//   });

//   const [series] = useState([
//     {
//       name: "SoH",
//       data: sohArray,
//     },
//   ]);

//   return (
//     <div className="app">
//       <div className="row">
//         <div className="flex justify-center items-centermixed-chart">
//           <Chart
//             options={options}
//             series={series}
//             type="line"
//             width="735"
//             height="180"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };
