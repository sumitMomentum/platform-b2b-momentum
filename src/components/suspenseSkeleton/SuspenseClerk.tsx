import {
  Backdrop,
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
} from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";
import React from "react";

function SuspenseClerk() {
  return (
    <div>
      <Backdrop sx={{ color: "#fff", zIndex: 100 }} open={true}>
        <Box sx={{ width: "50%" }}>
          <Typography variant="h3" gutterBottom>
            Authentication in Progress
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Sorry for the inconvenience
          </Typography>
          <LinearProgress color="success" />
        </Box>
      </Backdrop>
    </div>
  );
}

export default SuspenseClerk;
