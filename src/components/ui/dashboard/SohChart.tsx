"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { LineChart } from "@mui/x-charts/LineChart";
import { chartColorTheme } from "@/themes/ChartPalettes";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SohChart = ({ dashboardData }) => {
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

  const series = [
    {
      label: "SoH (%)",
      data:
        dashboardData.soh.length > 0
          ? dashboardData.soh
          : Array(xLabels.length).fill(0),
      color: "#77bc3f",
    },
  ];

  return (
    <LineChart
      width={700}
      height={300}
      series={series}
      colors={chartColorTheme}
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
