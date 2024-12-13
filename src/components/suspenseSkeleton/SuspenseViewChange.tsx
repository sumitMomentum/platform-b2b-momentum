import { Box, Skeleton } from "@mui/material";
import React from "react";

function SuspenseViewChange() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "right",
        width: "100%",
        alignItems: "center",
        margin: 2,
      }}
    >
      <Skeleton variant="rounded" width={100} height={40} />
    </Box>
  );
}

export default SuspenseViewChange;
