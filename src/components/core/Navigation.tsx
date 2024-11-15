"use client";
import { classNames } from "@/utils/facades/serverFacades/strFacade";
import { useSidebarState } from "@/states/ui/sidebarState";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

  const handleClick = (href: string) => {
    toggleSidebarMenu(); // Toggle the sidebar menu
    router.push(href); // Use router.push for navigation
  };

  return (
    <li>
      <ul role="list" className="-mx-2 space-y-1">
        {links.map((section) => (
          <div key={section.sectionName}>
            <span className="text-xs font-semibold leading-6 text-primary">
              {section.sectionName}
            </span>
            <List>
              {section.items.map((item) => (
                <ListItemButton
                  key={item.name}
                  component="div"
                  onClick={() => handleClick(item.href)} // Use the optimized click handler
                  className={classNames(
                    item.href === pathName
                      ? "bg-main-selected text-primary-selected"
                      : "bg-main-hover"
                  )}
                >
                  <ListItemIcon>
                    <item.icon
                      className={classNames(
                        item.href === pathName
                          ? "text-primary-selected"
                          : "text-primary",
                        "h-6 w-6 shrink-0 text-primary-hover"
                      )}
                      aria-hidden="true"
                    />
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
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
