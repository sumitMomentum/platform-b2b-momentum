import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { Fade } from "react-awesome-reveal";

const members = [
  {
    title: "VASUDEVAN RAJESH",
    designation: "CEO",
    description: [
      "VP at Kazam",
      "EV charging Investor",
      "Head of Ecosystem Alliances at Micelio",
      "EV-specific VC fund",
      "EV Consultant, Frost and Sullivan",
    ],
  },
  {
    title: "SUMIT RAO",
    designation: "CTO",
    description: [
      "CTO, Netmeds",
      "Spent 20 years building scalable platforms and leading tech teams",
      "Previously Engineering Leader at Athenahealth and ServiceNow",
    ],
  },
];

export default function Team() {
  return (
    <Fade duration={3000}>
      <Container
        id="pricing"
        sx={{
          pt: { xs: 4, sm: 12 },
          pb: { xs: 8, sm: 16 },
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
          <Typography
            component="h2"
            variant="h4"
            gutterBottom
            sx={{ color: "text.primary" }}
          >
            Team
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Leadership with a Purpose: Get to Know Our CTO and CEO
          </Typography>
        </Box>
        <Grid
          container
          spacing={3}
          sx={{ alignItems: "strech", justifyContent: "center", width: "100%" }}
        >
          {members.map((member) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={member.title}>
              <Card
                // elevation={10}
                sx={[
                  {
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    height: "100%",
                    borderColor: "primary.main",
                    boxShadow: 10,
                  },
                ]}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      color: "primary.main",
                    }}
                  >
                    <Typography component="h4" variant="h4">
                      {member.title}
                    </Typography>
                  </Box>
                  <Box
                    sx={[
                      {
                        mb: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      },
                    ]}
                  >
                    <Typography component="h4" variant="h6">
                      {member.designation}
                    </Typography>
                  </Box>
                  <Divider
                    sx={{ my: 2, opacity: 0.8, borderColor: "divider" }}
                  />
                  {member.description.map((line) => (
                    <Box
                      key={line}
                      sx={{
                        py: 1,
                        display: "flex",
                        gap: 1.5,
                        alignItems: "center",
                      }}
                    >
                      <VerifiedRoundedIcon
                        sx={{ width: 20, color: "primary.main" }}
                      />
                      <Typography
                        variant="subtitle2"
                        component={"span"}
                        sx={[
                          member.title === "Professional"
                            ? { color: "grey.50" }
                            : { color: null },
                        ]}
                      >
                        {line}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Fade>
  );
}
