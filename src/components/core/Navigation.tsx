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
    <li>
      <ul role="list">
        {links.map((section) => (
          <div key={section.sectionName}>
            {/* <span className="text-xs font-semibold leading-6 text-primary">
              {section.sectionName}
            </span> */}
            <List sx={{ width: "100%", maxWidth: 360 }} component="nav">
              {section.items.map((item) => (
                <ListItemButton
                  selected={item.href === pathName.replace("/en", "")}
                  key={item.name}
                  onClick={(event) => handleListItemClick(item.href)}
                  sx={{
                    "&&.Mui-selected": {
                      // Added this line to target the selected state
                      backgroundColor: "primary.main", // Change to your desired darker color
                      color: "white",
                      "& .MuiListItemIcon-root": {
                        // Added this line to target the icon color
                        color: "white", // Set icon color to white
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
          </div>
        ))}
      </ul>
    </li>
  );
};

export default Navigation;
