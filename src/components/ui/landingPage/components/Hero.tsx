"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { visuallyHidden } from "@mui/utils";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { breakpoints } from "@radix-ui/themes/dist/esm/props/prop-def.js";
import { error, log } from "console";
import { send, title } from "process";
import { toast } from "sonner";
import { text } from "stream/consumers";
import emailjs from "emailjs-com";
import src from "@emotion/styled";
import style from "styled-jsx/style";
import { Fade, Flip } from "react-awesome-reveal";
import Typewriter from "react-typewriter-effect";
import { transform } from "next/dist/build/swc";

// const StyledBox = styled("div")(({ theme }) => ({
//   alignSelf: "center",
//   width: "100%",
//   height: 400,
//   marginTop: theme.spacing(8),
//   borderRadius: theme.shape.borderRadius,
//   outline: "6px solid",
//   outlineColor: "hsla(220, 25%, 80%, 0.2)",
//   border: "1px solid",
//   borderColor: theme.palette.grey[200],
//   boxShadow: "0 0 12px 8px hsla(220, 25%, 80%, 0.2)",
//   backgroundImage: `url(${"/static/screenshots/material-ui/getting-started/templates/dashboard.jpg"})`,
//   backgroundSize: "cover",
//   [theme.breakpoints.up("sm")]: {
//     marginTop: theme.spacing(10),
//     height: 700,
//   },
//   ...theme.applyStyles("dark", {
//     boxShadow: "0 0 24px 12px hsla(210, 100%, 25%, 0.2)",
//     backgroundImage: `url(${"/static/screenshots/material-ui/getting-started/templates/dashboard-dark.jpg"})`,
//     outlineColor: "hsla(220, 20%, 42%, 0.1)",
//     borderColor: theme.palette.grey[700],
//   }),
// }));

export default function Hero() {
  const [email, setEmail] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendEmail = () => {
    if (!email) {
      toast.error("Please enter a email address.");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSending(true);
    // EmailJS parameters
    const templateParams = {
      user_email: email,
    };

    // Sending email using EmailJS
    emailjs
      .send(
        "service_f4p1c9i", // Replace with your EmailJS service ID
        "template_c7efne5", // Replace with your EmailJS template ID
        templateParams,
        "D0kRRX7ctwlY-_SHz" // Replace with your EmailJS public key
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          toast.success("Email sent successfully!"); // Show success toast
          setEmail(""); // Clear the email field after sending
        },
        (err) => {
          console.error("FAILED...", err);
          toast.error("Failed to send email. Please try again."); // Show error toast
        }
      )
      .finally(() => {
        setIsSending(false); // Re-enable button after operation
      });
  };

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        p: 10,
        width: "100%",
        backgroundRepeat: "no-repeat",

        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
        ...theme.applyStyles("dark", {
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
        }),
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: "center", width: { xs: "100%", sm: "70%" } }}
        >
          <Flip duration={400} triggerOnce={true}>
            <Typography
              variant="h1"
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                fontSize: "clamp(3rem, 10vw, 3.5rem)",
                whiteSpace: "nowrap",
              }}
            >
              Momentum-E
            </Typography>
          </Flip>
          <Typography
            component="span"
            variant="h1"
            sx={(theme) => ({
              fontSize: "clamp(2rem, 8vw, 1.75rem)",
              color: "primary.main",
              whiteSpace: "nowrap",
              ...theme.applyStyles("dark", {
                color: "primary.light",
              }),
            })}
          >
            <Typewriter
              text="Accelerating EV Adoption"
              cursorColor="#000000" // Customize the cursor color
              typeSpeed={25} // Speed of typing
              deleteSpeed={25} // Speed of typing
              delay={50} // Delay before starting
              repeat={1} // Ensure it types only once
            />
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              color: "text.secondary",
              width: { sm: "100%", md: "80%" },
            }}
          >
            <Fade delay={1500} triggerOnce={true}>
              AI-Driven battery Analytics And Fleet Management Platform
            </Fade>
          </Typography>
          <Fade delay={1000} triggerOnce={true}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              useFlexGap
              sx={{ pt: 2, width: { xs: "100%", sm: "350px" } }}
            >
              <InputLabel htmlFor="email-hero" sx={visuallyHidden}>
                Email
              </InputLabel>
              <TextField
                id="email-hero"
                hiddenLabel
                size="small"
                variant="outlined"
                aria-label="Enter your email address"
                placeholder="Your email address"
                fullWidth
                slotProps={{
                  htmlInput: {
                    autoComplete: "off",
                    "aria-label": "Enter your email address",
                  },
                }}
                value={email} // Set the email value from state
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                variant="contained"
                // color="primary"
                size="small"
                sx={(theme) => ({
                  color: "primary.main",
                  whiteSpace: "nowrap",
                  minWidth: "fit-content",
                  ...theme.applyStyles("dark", {
                    color: "primary.dark",
                  }),
                })}
                // sx={{ minWidth: "fit-content" }}
                onClick={sendEmail}
                disabled={isSending}
              >
                Request a Demo
              </Button>
            </Stack>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textAlign: "center" }}
            >
              By clicking &quot;Request a Demo&quot; you agree to our&nbsp;
              <Link href="#" color="primary">
                Terms & Conditions
              </Link>
            </Typography>
          </Fade>
        </Stack>

        <Box
          id="video-container"
          sx={(theme) => ({
            alignSelf: "center",
            width: "100%",
            height: "clamp(100px, 30vh, 700px)",
            marginTop: theme.spacing(8),
            borderRadius: theme.shape.borderRadius,
            outline: "6px solid",
            outlineColor: "hsla(220, 25%, 80%, 0.2)",
            border: "1px solid",
            borderColor: theme.palette.grey[200],
            boxShadow: "0 0 12px 8px hsla(220, 25%, 80%, 0.2)",
            overflow: "hidden",
            [theme.breakpoints.up("sm")]: {
              marginTop: theme.spacing(10),
              height: 700,
            },
            ...theme.applyStyles("dark", {
              boxShadow: "0 0 24px 12px hsla(210, 100%, 25%, 0.2)",
              outlineColor: "hsla(220, 20%, 42%, 0.1)",
              borderColor: theme.palette.grey[700],
            }),
          })}
        >
          <video
            src="/assets/videos/landingCarsVideo.mp4" // Path to the video in your public folder
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover", // This ensures the video covers the whole box without distorting aspect ratio
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}



  // <Box
  //   id="image"
  //   sx={(theme) => ({
  //     alignSelf: "center",
  //     width: "100%",
  //     height: 400,
  //     marginTop: theme.spacing(8),
  //     borderRadius: theme.shape.borderRadius,
  //     outline: "6px solid",
  //     outlineColor: "hsla(220, 25%, 80%, 0.2)",
  //     border: "1px solid",
  //     borderColor: theme.palette.grey[200],
  //     boxShadow: "0 0 12px 8px hsla(220, 25%, 80%, 0.2)",
  //     backgroundColor: "#000", // Set background color for better contrast
  //     position: "relative", // Ensure iframe can cover the box
  //     overflow: "hidden", // Prevent overflow from the iframe
  //     [theme.breakpoints.up("sm")]: {
  //       marginTop: theme.spacing(10),
  //       height: 700,
  //     },
  //     ...theme.applyStyles("dark", {
  //       boxShadow: "0 0 24px 12px hsla(210, 100%, 25%, 0.2)",
  //       outlineColor: "hsla(220, 20%, 42%, 0.1)",
  //       borderColor: theme.palette.grey[700],
  //     }),
  //   })}
  // >
  //   <iframe
  //     src={`https://www.youtube.com/embed/USSNBWtIzlk?autoplay=1&loop=1&playlist=USSNBWtIzlk&controls=0&showinfo=0&modestbranding=1&mute=1&quality=hd1080`} // Add loop and autoplay parameters
  //     frameBorder="0"
  //     allow="autoplay; encrypted-media"
  //     // allowFullScreen
  //     title="YouTube Video"
  //     style={{
  //       position: "absolute",
  //       top: "25%",
  //       left: "25%",
  //       width: "125%",
  //       height: "125%",
  //       transform: "translate(-25%, -25%) scale(1)",
  //       pointerEvents: "none",
  //     }} // Ensure iframe fits within the box
  //   />
  // </Box>;