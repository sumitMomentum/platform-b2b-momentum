import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";

import { title } from "process";
import { Slide } from "react-awesome-reveal";

const howWeHaveHelpedClients = [
  {
    icon: <AssessmentRoundedIcon />,
    title: "2% Error Margin",
    description:
      "Achieving a remarkably low error margin, ensuring high accuracy in our services.",
  },
  {
    icon: <AccessTimeRoundedIcon />,
    title: "30% Reduction in Fleet Downtime",
    description:
      "Significantly minimizing fleet downtime, leading to enhanced operational efficiency.",
  },
  {
    icon: <MonetizationOnRoundedIcon />,
    title: "50% Reduction in Personnel Costs",
    description:
      "Streamlining operations to reduce personnel costs by half, optimizing resource allocation.",
  },
  {
    icon: <EnergySavingsLeafIcon />,
    title: "20% Improvement in Battery Efficiency",
    description:
      "Enhancing battery efficiency by 20%, maximizing vehicle performance and lifespan.",
  },
];

export default function HowWeHaveHelpedClients() {
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
            How We Have Helped Clients
          </Typography>
          {/* <Typography variant="body1" sx={{ color: 'grey.400' }}>
            Explore why our product stands out: adaptability, durability,
            user-friendly design, and innovation. Enjoy reliable customer support and
            precision in every detail.
          </Typography> */}
        </Box>
        <Slide direction="right" triggerOnce={true}>
          <Grid container spacing={2}>
            {howWeHaveHelpedClients.map((item, index) => (
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
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography gutterBottom sx={{ fontWeight: "medium" }}>
                      {item.title}
                    </Typography>
                    <Box sx={{ opacity: "50%" }}>{item.icon}</Box>
                  </Box>
                  <div>
                    <Typography variant="body2" sx={{ color: "grey.400" }}>
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
