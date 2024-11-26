"use client";
import React, { Fragment } from "react";
import Image from "next/image";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Container,
  Divider,
} from "@mui/material";
import {
  SupportAgent,
  Group,
  Settings,
  SafetyDividerOutlined,
} from "@mui/icons-material";
import { useSidebarState } from "@/states/ui/sidebarState";
import Navigation from "../core/Navigation";
import Link from "next/link";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import useDarkTheme from "@/app/hooks/useDarkTheme";
import { constants } from "@/lib/constants";
import { useNavigation } from "../layouts/useNavigation";
import { useRouter } from "next/navigation";

const helpNavs = [
  // {
  //   name: "Support",
  //   icon: <SupportAgent />,
  //   href: "/home/support",
  // },
  // {
  //   name: "Affiliates",
  //   icon: <Group />,
  //   href: "/home/affiliates/link",
  // },
  {
    name: "Settings",
    icon: <Settings />,
    href: "/home/settings/profile",
  },
];

const AdminSidebar = () => {
  const { isDarkTheme } = useDarkTheme();
  const { isSidebarMenuOpen, toggleSidebarMenu } = useSidebarState(
    ({ isSidebarMenuOpen, toggleSidebarMenu }) => ({
      isSidebarMenuOpen,
      toggleSidebarMenu,
    })
  );

  const { adminNavigation } = useNavigation();
  const router = useRouter();

  return (
    <Box>
      {/* Mobile Sidebar (Drawer) */}
      <Drawer
        open={isSidebarMenuOpen}
        onClose={toggleSidebarMenu}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", lg: "none" }, // Show on small screens, hide on large
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
          backgroundColor: "background.paper",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            backgroundColor: "background.paper",
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 64,
              padding: 2,
            }}
          >
            <Link href={"/"}>
              <Image
                height={145}
                width={145}
                src={isDarkTheme ? constants.logoUrl : constants.logoDarkUrl}
                alt="Boilerplate"
              />
            </Link>
          </Box>
          <Divider />

          {/* Organization Switcher */}
          <Box sx={{ padding: 2 }}>
            <OrganizationSwitcher
              appearance={{
                baseTheme: isDarkTheme ? dark : undefined,
              }}
              hidePersonal={true}
              afterSelectPersonalUrl={"/home"}
              afterSelectOrganizationUrl={"/home"}
              afterCreateOrganizationUrl={"/home"}
              afterLeaveOrganizationUrl={"/home"}
            />
          </Box>
          <Divider sx={{ borderBottomWidth: "0.5px" }} />

          {/* Navigation */}
          <Navigation navigation={adminNavigation} />

          {/* Help Navs */}
          <Box>
            <Divider sx={{ borderBottomWidth: "0.5px" }} />

            <List>
              {helpNavs.map((item) => (
                <ListItemButton
                  key={item.name}
                  // selected={item.href === router.pathname}
                  onClick={() => {
                    router.push(item.href);
                    toggleSidebarMenu(); // Close drawer after navigation on mobile
                  }}
                  sx={{
                    "&&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "white",
                      "& .MuiListItemIcon-root": {
                        color: "white",
                      },
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Box>
      </Drawer>

      {/* Desktop Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { sm: "none", md: "block" }, // Hide on small screens, show on large
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 256,
            backgroundColor: "white",
          },
        }}
        open
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            // backgroundColor: "background.paper",
            flexGrow: "inherit",
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 64,
              padding: 2,
            }}
          >
            <Link href={"/"}>
              <Image
                height={145}
                width={145}
                src={isDarkTheme ? constants.logoUrl : constants.logoDarkUrl}
                alt="Boilerplate"
              />
            </Link>
          </Box>
          <Divider sx={{ borderBottomWidth: "0.5px" }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-between",
              flexGrow: "initial",
            }}
          >
            {/* Navigation */}
            <Navigation navigation={adminNavigation} />

            {/* Help Navs */}
            <Box>
              <Divider sx={{ borderBottomWidth: "0.5px" }} />
              <List>
                {helpNavs.map((item) => (
                  <ListItemButton
                    key={item.name}
                    // selected={item.href === router.pathname}
                    onClick={() => router.push(item.href)}
                    sx={{
                      "&&.Mui-selected": {
                        backgroundColor: "primary.main",
                        color: "white",
                        "& .MuiListItemIcon-root": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ marginRight: "5px" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      sx={{ paddingLeft: "10" }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      {/* <Box component="main" sx={{ flexGrow: 1, p: 3 }}> */}
      {/* Use Container for content with margins */}
      {/* <Container>Your main content goes here</Container> */}
      {/* </Box> */}
    </Box>
  );
};

export default AdminSidebar;
