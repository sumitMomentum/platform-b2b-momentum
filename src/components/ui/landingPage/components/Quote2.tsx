import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";

export default function Quote2() {
  return (
    <Box
      id="Quote2"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        // color: "white",
        // bgcolor: "grey.900",
      }}
    >
      <Container
        id="Quote2"
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
          <Stack spacing={3}>
            <Typography
              variant="h4"
              sx={(theme) => ({ color: "primary.main"})}
            >
              An AI/ML led platform to provide vehicle owners with valuable
              information regarding battery health, performance, real range and
              charging optimization.
            </Typography>
            <Typography
              variant="h4"
              sx={(theme) => ({ color: "primary.main"})}
            >
              An EV “credit score” to revolutionize the resale of electric
              vehicles in addition to managing the Second life of batteries.
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
