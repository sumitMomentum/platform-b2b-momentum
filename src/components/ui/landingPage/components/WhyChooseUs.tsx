import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import DataObjectRoundedIcon from "@mui/icons-material/DataObjectRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import PowerRoundedIcon from "@mui/icons-material/PowerRounded";
import FlashOnRoundedIcon from "@mui/icons-material/FlashOnRounded";
import { title } from "process";
import { Slide } from "react-awesome-reveal";

const whyChooseUs = [
  {
    icon: <DataObjectRoundedIcon />,
    title: "Proprietary ML Models",
    description:
      "Utilizing proprietary machine learning models trained on extensive data from thousands of vehicles.",
  },
  {
    icon: <DirectionsCarFilledRoundedIcon />,
    title: "Vehicle Agnostic",
    description:
      "Compatible with any vehicle make and model, ensuring universal application.",
  },
  {
    icon: <PowerRoundedIcon />,
    title: "No Aftermarket Hardware",
    description:
      "Offering seamless plug-and-play software solutions without the need for additional hardware.",
  },
  {
    icon: <FlashOnRoundedIcon />,
    title: "Innovative Technology",
    description:
      "Embracing cutting-edge technology to enhance vehicle performance and efficiency.",
  },
];

export default function WhyChooseUs() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: "white",
        bgcolor: "grey.900",
      }}
    >
      <Container
        id="whyChooseUs"
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
          <Typography component="h2" variant="h4" gutterBottom>
            Why Choose Us
          </Typography>
          {/* <Typography variant="body1" sx={{ color: 'grey.400' }}>
            Explore why our product stands out: adaptability, durability,
            user-friendly design, and innovation. Enjoy reliable customer support and
            precision in every detail.
            </Typography> */}
        </Box>
        <Slide triggerOnce={true}>
          <Grid container spacing={2}>
            {whyChooseUs.map((item, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }} key={index}>
                <Stack
                  direction="column"
                  component={Card}
                  spacing={1}
                  useFlexGap
                  sx={{
                    color: "inherit",
                    p: 3,
                    height: "100%",
                    borderColor: "hsla(220, 25%, 25%, 0.3)",
                    backgroundColor: "grey.800",
                  }}
                >
                  <Box sx={{ opacity: "50%", textAlign: "center" }}>
                    {item.icon}
                  </Box>
                  <div>
                    <Typography
                      gutterBottom
                      sx={{ fontWeight: "medium", textAlign: "center" }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "grey.400", textAlign: "center" }}
                    >
                      {item.description}
                    </Typography>
                  </div>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Slide>
      </Container>
    </Box>
  );
}
