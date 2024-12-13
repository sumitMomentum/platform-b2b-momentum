import React from "react";
import { Box, Skeleton } from "@mui/material";

const SuspenseTable = () => (
  <Box sx={{ padding: "20px", width: "100%" }}>
    {/* Header Row */}
    <Box sx={{ display: "flex", gap: 2, marginBottom: "20px" }}>
      <Skeleton variant="rectangular" width="20%" height={40} />
      <Skeleton variant="rectangular" width="20%" height={40} />
      <Skeleton variant="rectangular" width="20%" height={40} />
      <Skeleton variant="rectangular" width="20%" height={40} />
      <Skeleton variant="rectangular" width="20%" height={40} />
    </Box>

    {/* Rows */}
    {Array.from({ length: 7 }).map((_, index) => (
      <Box
        key={index}
        sx={{
          display: "flex",
          gap: 2,
          marginBottom: "10px",
        }}
      >
        <Skeleton variant="rectangular" width="20%" height={30} />
        <Skeleton variant="rectangular" width="20%" height={30} />
        <Skeleton variant="rectangular" width="20%" height={30} />
        <Skeleton variant="rectangular" width="20%" height={30} />
        <Skeleton variant="rectangular" width="20%" height={30} />
      </Box>
    ))}
  </Box>
);

export default SuspenseTable;
