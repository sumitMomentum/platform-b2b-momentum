"use client";

import React from "react";
// import { useState } from "react"; // Added useState for drawer state
import { Drawer } from "@mui/material"; // Import Drawer from MUI
import useDarkTheme from "@/app/hooks/useDarkTheme";
import { useSidebarState } from "@/states/ui/sidebarState";
import Image from "next/image";
import Link from "next/link";
import { constants } from "@/lib/constants";
import { useNavigation } from "../layouts/useNavigation";
import Navigation from "../core/Navigation";
import { useTranslations } from "next-intl";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SettingsIcon from "@mui/icons-material/Settings";

const AdminSidebar = () => {
  // const { isDarkTheme } = useDarkTheme();
  const { toggleSidebarMenu } = useSidebarState(({ toggleSidebarMenu }) => ({
    toggleSidebarMenu,
  }));
  // const [drawerOpen, setDrawerOpen] = useState(false); // State for drawer open/close

  // const handleDrawerToggle = () => {
  //   setDrawerOpen(!drawerOpen); // Toggle drawer state
  // };
  const { adminNavigation } = useNavigation();
  const t = useTranslations("AdminLayout.navigation");
  return (
    <div>
      {/* <button onClick={handleDrawerToggle}>Toggle Sidebar</button>{" "} */}
      {/* Button to toggle drawer */}
      <Drawer anchor="left" open={true}>
        {/* <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}> */}
        <div className="flex flex-col gap-y-5 overflow-y-auto bg-main text-primary px-6 pb-4">
          {/* ... existing sidebar content ... */}
          <div className="flex h-11 shrink-0 items-center justify-center">
            <Link href={"/"}>
              <Image
                height={145}
                width={145}
                className="pt-5"
                src={constants.logoDarkUrl}
                // src={isDarkTheme ? constants.logoUrl : constants.logoDarkUrl}
                alt="Boilerplate"
              />
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className=" space-y-1">
                  <Navigation navigation={adminNavigation} />
                </ul>
              </li>
              <li className="mt-auto">
                <Link
                  onClick={() => toggleSidebarMenu()}
                  href="/home/support"
                  className="bg-main group flex gap-x-3 rounded-md p-2 text-primary"
                >
                  <SupportAgentIcon
                    className="h-6 w-6 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  {t("support")}
                </Link>
                <Link
                  onClick={() => toggleSidebarMenu()}
                  href="/home/settings/profile"
                  className="bg-main group flex gap-x-3 rounded-md p-2 text-primary"
                >
                  <SettingsIcon
                    className="h-6 w-6 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  {t("settings")}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </Drawer>
    </div>
  );
};

export default AdminSidebar;
