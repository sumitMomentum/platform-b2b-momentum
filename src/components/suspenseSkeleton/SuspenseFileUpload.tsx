import { Box } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import React from "react";

function SuspenseFileUpload() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        margin: 2,
      }}
    >
      <Skeleton variant="rounded" width={240} height={40} />
      <Skeleton variant="rounded" width={100} height={40} />
    </Box>
  );
}

export default SuspenseFileUpload;
