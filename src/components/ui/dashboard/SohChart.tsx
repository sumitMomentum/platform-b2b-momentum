"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SohChart = () => {
  const sohArray = [
    [
      100.0, 99.67, 98.45, 97.56, 96.89, 95.78, 94.65, 93.89, 92.76, 91.56,
      90.34, 88.23,
    ],
    [
      99.98, 98.67, 97.54, 96.12, 95.78, 94.9, 93.45, 92.01, 91.34, 90.09,
      89.02, 88.0,
    ],
    [
      100.0, 99.23, 98.78, 97.89, 96.9, 95.87, 94.45, 93.34, 92.56, 91.32,
      90.01, 88.78,
    ],
    [
      99.99, 98.67, 97.9, 96.67, 95.45, 94.78, 93.9, 92.34, 91.01, 90.0, 89.32,
      88.12,
    ],
    [
      100.0, 99.89, 98.78, 97.67, 96.45, 95.32, 94.01, 93.0, 92.34, 91.23, 90.1,
      88.9,
    ],
    [
      99.99, 98.9, 97.76, 96.67, 95.54, 94.67, 93.78, 92.89, 91.9, 90.67, 89.45,
      88.34,
    ],
    [
      100.0, 99.45, 98.78, 97.67, 96.56, 95.34, 94.12, 93.09, 92.0, 91.0, 90.12,
      88.89,
    ],
    [
      99.99, 98.89, 97.9, 96.78, 95.67, 94.45, 93.23, 92.01, 91.0, 90.01, 89.1,
      88.0,
    ],
    [
      100.0, 99.9, 98.89, 97.78, 96.67, 95.56, 94.34, 93.12, 92.0, 91.0, 90.0,
      88.89,
    ],
    [
      99.99, 98.9, 97.89, 96.78, 95.67, 94.56, 93.34, 92.12, 91.0, 90.0, 89.0,
      88.0,
    ],
  ];

  const randomNumber = Math.floor(Math.random() * 11);

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
      data: sohArray[randomNumber],
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
