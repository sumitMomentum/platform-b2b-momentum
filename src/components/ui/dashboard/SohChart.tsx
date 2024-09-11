"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SohChart = ({dashboardData}) => {
  const sohArray = dashboardData.soh

  const [options] = useState({
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: [
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
      ],
    },
    yaxis: {
      labels: {
        formatter: function (value: number) {
          return value + " %";
        },
      },
    },
  });

  const [series] = useState([
    {
      name: "SoH",
      data: sohArray,
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
            height="180"
          />
        </div>
      </div>
    </div>
  );
};

export default SohChart;
