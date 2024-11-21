import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SocChart = ({ soc }) => {
  // State for dynamic chart dimensions
  const [chartSize, setChartSize] = useState({ width: 300, height: 240 });

  // Function to handle screen resize and adjust chart size
  const handleResize = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 640) {
      // Small screens
      setChartSize({ width: 200, height: 200 });
    } else if (screenWidth <= 1024) {
      // Medium screens
      setChartSize({ width: 250, height: 220 });
    } else {
      // Large screens
      setChartSize({ width: 300, height: 240 });
    }
  };

  useEffect(() => {
    // Set initial size based on screen width
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [options] = useState({
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 360,
        hollow: {
          margin: 0,
          size: "70%",
          background: "`​#77bc3f`",
        },
        track: {
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            blur: 4,
            opacity: 0.15,
          },
        },
        dataLabels: {
          name: {
            offsetY: -10,
            color: "#fff",
            fontSize: "13px",
          },
          value: {
            color: "#fff",
            fontSize: "30px",
            show: true,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        gradientToColors: ["#87D4F9"],
        stops: [0, 100],
      },
    },
    labels: ["Charge"],
  });

  const [series] = useState([soc]);

  return (
    <div className="flex justify-center items-center">
      <Chart
        options={options}
        series={series}
        type="radialBar"
        height={chartSize.height}
        width={chartSize.width}
      />
    </div>
  );
};

export default SocChart;
