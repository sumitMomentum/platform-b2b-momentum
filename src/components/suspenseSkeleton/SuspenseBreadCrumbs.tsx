import React from "react";
import { Box, Skeleton } from "@mui/material";

const SuspenseBreadCrumbs = () => {
  return (
    <Box>
      <Skeleton
        animation="wave"
        width={70}
        height={40}
        style={{ display: "inline-block", marginRight: 8 }}
      />
      <Skeleton
        animation="wave"
        width={70}
        height={40}
        style={{ display: "inline-block", marginRight: 8 }}
      />
      {/* <Skeleton animation="wave" width={170} height={60} /> */}
    </Box>
  );
};

export default SuspenseBreadCrumbs;
