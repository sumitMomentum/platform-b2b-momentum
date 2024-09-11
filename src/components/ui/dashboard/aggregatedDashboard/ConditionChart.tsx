"use client";

import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";
import { PieChart } from "@mui/x-charts";
import { log } from "console";
import dynamic from "next/dynamic";
import { config } from "process";
import { useEffect, useState } from "react";
import colors from "tailwindcss/colors";
// const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ConditionChart = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const vehicles = await getUserVehicles();

      // Initialize an object to store counts for each condition
      const conditionCounts = {
        Critical: 0,
        Satisfactory: 0,
        Good: 0,
      };

      // Iterate through vehicles and increment counts based on condition
      vehicles.forEach((vehicle) => {
        if (vehicle.condition === "Critical") {
          // Assuming 'condition' is a property on the vehicle object
          conditionCounts.Critical++;
        } else if (vehicle.condition === "Satisfactory") {
          conditionCounts.Satisfactory++;
        } else {
          conditionCounts.Good++;
        }
      });

      // Create series data from the conditionCounts object
      setSeries([
        { label: "Critical", value: conditionCounts.Critical },
        { label: "Satisfactory", value: conditionCounts.Satisfactory },
        { label: "Good", value: conditionCounts.Good },
      ]);
      setLoading(false);
    }

    fetchData();
    console.log(series);
  }, []);

  const options = {
    labels: ["Critical", "Satisfactory", "Good"],
    colors: ["#e74c3c", "#f1c40f", "#2ecc71"],
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return opts.w.config.series[opts.seriesIndex];
      },
    },
  };

  return (
    <PieChart
      loading={loading}
      series={[{ data: series }]}
      colors={["#e74c3c", "#f1c40f", "#2ecc71"]}
      width={400}
      height={200}
    />
  );
};

export default ConditionChart;

// const ConditionChart = () => {
//   const [series, setSeries] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//       const vehicles = await getUserVehicles();

//       setSeries([
//         vehicles.reduce(
//           (count, vehicle) =>
//             vehicle.condition === "Critical" ? count + 1 : count,
//           0
//         ),
//         vehicles.reduce(
//           (count, vehicle) =>
//             vehicle.condition === "Satisfactory" ? count + 1 : count,
//           0
//         ),
//         vehicles.reduce(
//           (count, vehicle) =>
//             vehicle.condition === "Good" ? count + 1 : count,
//           0
//         ),
//       ]);
//     }

//     fetchData(); // Call the async function within useEffect
//   }, []); // Empty dependency array ensures useEffect runs only once after initial render

//   const options = {
//     labels: ["Critical", "Satisfactory", "Good"],
//     colors: ["#e74c3c", "#f1c40f", "#2ecc71"],
//     dataLabels: {
//       enabled: true,
//       formatter: function (val, opts) {
//         return opts.w.config.series[opts.seriesIndex];
//       },
//     },
//   };

//   return (
//     <div>
//       {/* Conditionally render the chart to prevent errors when 'series' is empty */}
//       {series.length > 0 && (
//         <Chart
//           options={options}
//           series={series}
//           type="pie"
//           width="350"
//           height="auto"
//         />
//       )}
//     </div>
//   );
// };
// "use client"
// import dynamic from 'next/dynamic'
// const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// const ConditionChart = () => {
//   const series = [10, 50, 102];

//   const options = {
//     labels: ['Critical', 'Satisfactory', 'Good'],
//     colors: ['#e74c3c', '#f1c40f', '#2ecc71'],
//     dataLabels: {
//       enabled: true,
//       formatter: function (val, opts) {
//         return opts.w.config.series[opts.seriesIndex];
//       },
//     },
//   };

//   return (
//     <div>
//       <Chart options={options} series={series} type="pie" width="370" height="auto" />
//     </div>
//   );
// };

// export default ConditionChart;
