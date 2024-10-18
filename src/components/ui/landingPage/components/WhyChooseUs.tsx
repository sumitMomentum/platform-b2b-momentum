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
import { dark } from "@clerk/themes";
import { grey } from "@mui/material/colors";
import { light } from "@mui/material/styles/createPalette";

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
      id="whyChooseUs"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        // color: "white",
        // bgcolor: "grey.900",
      }}
    >
      <Container
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
                  sx={(theme) => ({
                    boxShadow:5,
                    p: 3,
                    height: "100%",
                    borderColor:
                      theme.palette.mode === "dark"
                        ? theme.palette.primary.dark
                        : "black",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark" ? "black" : "white",
                    },
                    // Styling for the icon
                    "& .icon": {
                      color: theme.palette.primary.main,
                    },
                    // Change icon color on hover
                    "&:hover .icon .title": {
                      color:
                        theme.palette.primary[
                          theme.palette.mode === "dark" ? "light" : "dark"
                        ],
                    },
                    // Styling for the title
                    "& .title": {
                      color: theme.palette.primary.main, // Static color for the title
                    },
                    // Title hover remains the same (you can modify it if needed)
                    "&:hover .title": {
                      color:
                        theme.palette.primary[
                          theme.palette.mode === "dark" ? "light" : "dark"
                        ],
                    },
                    // Styling for the description
                    "& .desc": {
                      color: theme.palette.grey[400],
                    },
                    // Change description color on hover
                    "&:hover .desc": {
                      color:
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.dark
                          : "black",
                    },
                  })}
                >
                  <Box className="icon" sx={{ textAlign: "center" }}>
                    {item.icon}
                  </Box>
                  <div>
                    <Typography
                      className="title"
                      gutterBottom
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      className="desc"
                      variant="body2"
                      sx={{
                        textAlign: "center",
                      }}
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
