//@ts-nocheck

"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";
import useVehicleStore from "@/states/store";
import { BarChart } from "@mui/x-charts/BarChart";
import { chartColorTheme } from "@/themes/ChartPalettes";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const DistanceTravelledChart = () => {
  const vehicles = useVehicleStore((state) => state.vehicles);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get unique makes from the vehicles array
    setLoading(true);
    const uniqueMakes = [...new Set(vehicles.map((vehicle) => vehicle.make))];

    // Calculate monthly usage for each make
    const usageData = uniqueMakes.map((make) => {
      const filteredVehicles = vehicles.filter(
        (vehicle) => vehicle.make === make
      );
      const monthlyUsage = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(
        (_, index) => {
          return filteredVehicles.reduce((monthTotal, vehicle) => {
            const distance = parseFloat(vehicle.monthlyUsage[index]) || 0;
            return monthTotal + distance;
          }, 0);
        }
      );

      return {
        label: make,
        data: monthlyUsage,
        id: make + "Id",
        stack: "total",
      };
    });

    setSeries(usageData);
    console.log(usageData);
    vehicles.length && setLoading(false);
  }, [vehicles]);

  const [series, setSeries] = useState([]);
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
      loading={loading}
      width={700}
      height={300}
      series={series}
      colors={chartColorTheme}
      xAxis={[{ data: xLabels, scaleType: "band" }]}
    />
  );
};

export default DistanceTravelledChart;

// const DistanceTravelledChart = () => {
//   const vehicles = useVehicleStore((state) => state.vehicles);
//   const setVehicles = useVehicleStore((state) => state.setVehicles);

//   useEffect(() => {
//     const getVehicles = async () => {
//       // Make getVehicles async
//       if (!vehicles || vehicles.length === 0) {
//         const userVehiclesFromDB = await getUserVehicles();
//         // console.log(userVehiclesFromDB);
//         setVehicles(userVehiclesFromDB);
//       }
//     };

//     getVehicles(); // Call the async function
//   }, [vehicles, setVehicles]);

//   const [monthlyUsageByMake, setMonthlyUsageByMake] = useState([]);

//   useEffect(() => {
//     // Get unique makes from the vehicles array
//     const uniqueMakes = [...new Set(vehicles.map((vehicle) => vehicle.make))];

//     // Calculate monthly usage for each make
//     const usageData = uniqueMakes.map((make) => {
//       const filteredVehicles = vehicles.filter(
//         (vehicle) => vehicle.make === make
//       );
//       const monthlyUsage = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(
//         (_, index) => {
//           return filteredVehicles.reduce((monthTotal, vehicle) => {
//             const distance = parseFloat(vehicle.MonthlyUsage[index]) || 0;
//             return monthTotal + distance;
//           }, 0);
//         }
//       );

//       return { name: make, data: monthlyUsage };
//     });

//     setMonthlyUsageByMake(usageData);
//     setSeries(usageData);
//     console.log(usageData);
//   }, [vehicles]);

//   const [options] = useState({
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
//     chart: {
//       stacked: true,
//     },
//     plotOptions: {
//       bar: {
//         distributed: false,
//       },
//     },
//     yaxis: {
//       labels: {
//         formatter: function (value: number) {
//           return value + " km";
//         },
//       },
//     },
//   });

//   const [series, setSeries] = useState([]);

//   return (
//     <div className="app">
//       <div className="row">
//         <div className="flex justify-center items-center mixed-chart">
//           <Chart
//             options={options}
//             series={series}
//             type="bar"
//             width="735"
//             height="250"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };
