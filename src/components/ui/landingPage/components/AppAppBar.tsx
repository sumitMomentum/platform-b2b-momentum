// @ts-ignore

"use client";

import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Sitemark from "./SitemarkIcon";
import style from "styled-jsx/style";
import Link from "next/link";
import BtnBuyService from "../../commons/BtnBuyService";
import ToggleColorMode from "./ToggleColorMode";
import { dark } from "@clerk/themes";
import { SignInButton } from "@clerk/nextjs";
import loading from "@/components/suspenseSkeleton/loading";
import src from "@emotion/styled";

export default function AppAppBar({ mode, toggleColorMode }) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: 10,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          variant="regular"
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            borderRadius: "999px",
            bgcolor:
              theme.palette.mode === "light"
                ? "rgba(255, 255, 255, 0.4)"
                : "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(24px)",
            maxHeight: 40,
            border: "1px solid",
            borderColor: "divider",
            boxShadow:
              theme.palette.mode === "light"
                ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
          })}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              px: 0,
              gap: 2,
            }}
          >
            {/* <Sitemark /> */}
            <img
              src={"/assets/img/logo_black_nocap.png"}
              // src={
              //   mode === "light"
              //     ? "/assets/img/logo_black_nocap.png"
              //     : "/assets/img/logo_white_nocap.png"
              // }
              alt="Logo"
              loading="lazy" // Lazy load the image
              style={{
                maxHeight: "100px", // Adjust the maximum height of the logo
                maxWidth: "100px", // Adjust the maximum width of the logo
                objectFit: "contain", // Ensures the image maintains its aspect ratio
                width: "auto",
                height: "auto",
              }}
              sizes="(max-width: 600px) 50px, (max-width: 900px) 75px, 100px" // Responsive sizes
            />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {/*<Button variant="text" color="info" size="small">
                Features
              </Button>
              <Button variant="text" color="info" size="small">
                Highlights
              </Button>
              <Button variant="text" color="info" size="small">
                Testimonials
              </Button>
              <Button variant="text" color="info" size="small">
                Pricing
              </Button>
               <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
                FAQ
              </Button> 
               <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
                Blog
              </Button> */}
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              // display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {/* <ToggleColorMode
              data-screenshot="toggle-mode"
              mode={mode}
              toggleColorMode={toggleColorMode}
            /> */}
            <SignInButton>
              <Button variant="contained" size="small">
                Sign In
              </Button>
            </SignInButton>
            {/* <Button color="primary" variant="contained" size="small">
              Sign up
            </Button> */}
          </Box>
          {/* <Box sx={{ display: { sm: "flex", md: "none" } }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ my: 3 }} />
                <MenuItem>Features</MenuItem>
                <MenuItem>Highlights</MenuItem>
                <MenuItem>Testimonials</MenuItem>
                <MenuItem>Pricing</MenuItem>
                 <MenuItem>FAQ</MenuItem> 
                 <MenuItem>Blog</MenuItem> 
                 <MenuItem>
                  <Button color="primary" variant="contained" fullWidth>
                    Sign up
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Link href={"/home"} passHref>
                    <Button color="primary" variant="contained" size="small">
                      Sign in
                    </Button>
                  </Link>
                  <ToggleColorMode
              data-screenshot="toggle-mode"
              mode={mode}
              toggleColorMode={toggleColorMode}
            />
                </MenuItem>
              </Box>
            </Drawer>
          </Box> */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
