// @ts-nocheck  // Consider removing this if possible and adding proper TypeScript types
"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
// import { getVehicleDashboardData } from "@/actions/admin/dashboardModule/get-vehicle-dashboard-data";
import useVehicleStore from "@/states/store";
import { LineChart } from "@mui/x-charts/LineChart";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const BatteryHealthChart = () => {
  const vehicles = useVehicleStore((state) => state.vehicles);
  const setVehicles = useVehicleStore((state) => state.setVehicles);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getVehicles = async () => {
      if (!vehicles || vehicles.length === 0) {
        const userVehiclesFromDB = await getUserVehicles();
        setVehicles(userVehiclesFromDB);
      }
    };

    getVehicles();
  }, [vehicles, setVehicles]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        // Group by make and accumulate SOH values for each month
        const groupedData = vehicles.reduce((acc, vehicle) => {
          const make = vehicle.make;
          if (!acc[make]) {
            acc[make] = { make, sohValues: Array(12).fill(0), count: 0 };
          }

          vehicle["soh"].forEach((sohValue, monthIndex) => {
            acc[make].sohValues[monthIndex] += sohValue;
          });
          acc[make].count++;
          return acc;
        }, {});

        // Calculate average SOH for each month for each make
        const averagedData = Object.values(groupedData).map((group) => {
          const monthlyAvgSoh = group.sohValues.map((monthTotal) =>
            group.count > 0 ? monthTotal / group.count : 0
          );
          return { label: group.make, data: monthlyAvgSoh };
        });

        setSeries(averagedData);
        console.log(series);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
    setLoading(false);
  }, [vehicles]); // Dependency on 'vehicles'// Dependency on 'vehicles'

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
    <LineChart
      loading={loading}
      width={700}
      height={300}
      series={series}
      xAxis={[{ scaleType: "point", data: xLabels }]}
    />
  );
};

export default BatteryHealthChart;

// const BatteryHealthChart = () => {
//   const vehicles = useVehicleStore((state) => state.vehicles);
//   const setVehicles = useVehicleStore((state) => state.setVehicles);
//   const [series, setSeries] = useState([]);

//   useEffect(() => {
//     const getVehicles = async () => {
//       if (!vehicles || vehicles.length === 0) {
//         const userVehiclesFromDB = await getUserVehicles();
//         setVehicles(userVehiclesFromDB);
//       }
//     };

//     getVehicles();
//   }, [vehicles, setVehicles]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Group by make and accumulate SOH values for each month
//         const groupedData = vehicles.reduce((acc, vehicle) => {
//           const make = vehicle.make;
//           if (!acc[make]) {
//             acc[make] = { make, sohValues: Array(12).fill(0), count: 0 };
//           }

//           vehicle["soh"].forEach((sohValue, monthIndex) => {
//             acc[make].sohValues[monthIndex] += sohValue;
//           });
//           acc[make].count++;
//           return acc;
//         }, {});

//         // Calculate average SOH for each month for each make
//         const averagedData = Object.values(groupedData).map((group) => {
//           const monthlyAvgSoh = group.sohValues.map((monthTotal) =>
//             group.count > 0 ? monthTotal / group.count : 0
//           );
//           return { name: group.make, data: monthlyAvgSoh };
//         });

//         setSeries(averagedData);
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       }
//     };

//     fetchData();
//   }, [vehicles]); // Dependency on 'vehicles'

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
//         formatter: function (value) {
//           return value + " %";
//         },
//       },
//     },
//   });

//   return (
//           <Chart
//             options={options}
//             series={series}
//             type="line" // Assuming you want a line chart
//             width="735"
//             height="250"
//           />
//   );
// };
