"use client"

import {
  Backdrop,
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter from Next.js

function SuspenseClerk() {
  return (
    <div>
      <Backdrop sx={{ color: "#fff", zIndex: 100 }} open={true}>
        <Box sx={{ width: "50%" }}>
          <Typography variant="h3" gutterBottom>
            Navigation in Progress
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

const SuspenseNavigation = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true); // Set loading to true when navigation starts
    const handleComplete = () => setLoading(false); // Set loading to false when navigation ends

    router.events.on("routeChangeStart", handleStart); // Listen for route change start
    router.events.on("routeChangeComplete", handleComplete); // Listen for route change complete
    router.events.on("routeChangeError", handleComplete); // Handle route change error

    return () => {
      router.events.off("routeChangeStart", handleStart); // Clean up event listener
      router.events.off("routeChangeComplete", handleComplete); // Clean up event listener
      router.events.off("routeChangeError", handleComplete); // Clean up event listener
    };
  }, [router.events]);

  return (
    <>
      {loading && <SuspenseClerk />} {/* Show SuspenseClerk when loading */}
      {/* Other components can be rendered here */}
    </>
  );
};

export default SuspenseNavigation;
