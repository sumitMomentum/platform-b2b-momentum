"use client";

import Grid from "@mui/material/Grid";
import React from "react";
import SuspenseTable from "./SuspenseTable";
import { Box, Skeleton, Typography } from "@mui/material";

function SuspenseChartGrid() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Overview Section */}
      <Grid container spacing={1} columns={12} sx={{ mb: 2 }}>
        {/* Stat Cards */}
        {[1, 2, 3, 4].map((index) => (
          <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
            <Skeleton sx={{ height: "100px", flexGrow: 1 }} />
          </Grid>
        ))}

        {/* Actions Closed Over Time Chart */}
        <Grid item xs={12} md={6} lg={6}>
          <Skeleton sx={{ width: "100%", height: "300px" }} />
        </Grid>

        {/* Severity Distribution Chart */}
        <Grid item xs={12} md={6} lg={6}>
          <Skeleton sx={{ width: "100%", height: "300px" }} />
        </Grid>
      </Grid>

      {/* Details Section */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        <Skeleton sx={{ width: "100%" }} />
      </Typography>
      <Grid container spacing={2} columns={12}>
        {/* Data Grid Section */}
        <Grid item xs={12}>
          <SuspenseTable />
        </Grid>
      </Grid>
    </Box>
  );
}

export default SuspenseChartGrid;
