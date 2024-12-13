"use client";
import { classNames } from "@/utils/facades/serverFacades/strFacade";
import { useSidebarState } from "@/states/ui/sidebarState";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { map } from "svix/dist/openapi/rxjsStub";
import { current } from "tailwindcss/colors";
import { Box } from "@radix-ui/themes";
import style from "styled-jsx/style";

interface NavigationSection {
  sectionName: string;
  items: NavigationItem[];
}

type NavigationItem = {
  name: string;
  href: string;
  icon: any;
  current: boolean;
};

const Navigation = ({ navigation }: { navigation: NavigationSection[] }) => {
  const router = useRouter();
  const { toggleSidebarMenu } = useSidebarState(({ toggleSidebarMenu }) => ({
    toggleSidebarMenu,
  }));

  const pathName = usePathname();
  const [links, setLinks] = useState<NavigationSection[]>(navigation);

  useEffect(() => {
    // Update links based on the current pathname
    const updatedLinks = navigation.map((section) => ({
      ...section,
      items: section.items.map((item) => ({
        ...item,
        current: item.href === pathName,
      })),
    }));
    setLinks(updatedLinks);
  }, [navigation, pathName]);

  const handleListItemClick = (href: string) => {
    // toggleSidebarMenu(); // Toggle the sidebar menu
    router.push(href); // Use router.push for navigation
  };

  return (
    <Box>
      {links.map((section) => (
        <div key={section.sectionName}>
          {/* <span className="text-xs font-semibold leading-6 text-primary">
              {section.sectionName}
            </span> */}
          <List sx={{ width: "100%", maxWidth: 360 }} component="nav">
            {section.items.map((item) => (
              <Link
                href={item.href}
                key={item.name}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton
                  selected={item.href === pathName.replace("/en", "")}
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
              </Link>
            ))}
          </List>
        </div>
      ))}
    </Box>
  );
};

export default Navigation;
