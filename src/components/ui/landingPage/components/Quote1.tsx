import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";


export default function Quote1() {
  return (
    <Box
      id="Quote1"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: "white",
        bgcolor: "grey.900",
      }}
    >
      <Container
        id="Quote1"
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: "100%", md: "60%" },
            textAlign: { sm: "left", md: "center" },
          }}
        >
          <Typography component="h2" variant="h3" gutterBottom>
            MAKING EV TRANSITION SEAMLESS
          </Typography>
          <Typography variant="h4" sx={{ color: "#6afef6" }}>
            Helping EV fleets and financing companies understand battery
            degradation, optimize charging, reduce TCO and build clarity on the
            resale values of vehicles.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
