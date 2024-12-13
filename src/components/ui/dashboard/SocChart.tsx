import React, { useState, useEffect } from "react";
import { Gauge, gaugeClasses, GaugeContainer } from "@mui/x-charts/Gauge";
import { Box } from "@mui/material";
import { transform } from "next/dist/build/swc";
import { text } from "stream/consumers";

const SocChart = ({ soc }) => {
  return (
    <Gauge
      value={soc}
      // width={width}
      // height={height}
      startAngle={0}
      endAngle={360}
      innerRadius="70%"
      outerRadius="100%"
      sx={{
        [`& .${gaugeClasses.valueText}`]: {
          transform: "translate(0px, 0px)",
        },
      }}
      text={({ value, valueMax }) => `${value} %`}
    />
  );
};

export default SocChart;
