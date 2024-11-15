"use client";
import { classNames } from "@/utils/facades/serverFacades/strFacade";
import { useSidebarState } from "@/states/ui/sidebarState";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { map } from "svix/dist/openapi/rxjsStub";

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
  const { toggleSidebarMenu } = useSidebarState(({ toggleSidebarMenu }) => ({
    toggleSidebarMenu,
  }));

  const pathName = usePathname();
  let seg = pathName.split("/");
  let pathNameWithoutLand = "/" + seg.slice(2).join("/");
  const [links, setLinks] = useState<NavigationSection[]>([]);
  console.log(pathNameWithoutLand);

  useEffect(() => {
    const linksWithStatus = navigation.map((section) => {
      return {
        ...section,
        items: section.items.map((item) => {
          return {
            ...item,
            current: item.href === location.pathname,
          };
        }),
      };
    });

    setLinks(linksWithStatus);

    // // Check if the new links are different from the current links
    // if (JSON.stringify(linksWithStatus) !== JSON.stringify(links)) {
    //   setLinks(linksWithStatus);
    // }
    // }, []);
  }, [navigation, pathName]);

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
                  component={Link} // Use MUI's Link component
                  href={item.href}
                  onClick={() => toggleSidebarMenu()}
                  className={classNames(
                    item.href === pathNameWithoutLand
                      ? "bg-main-selected text-primary-selected"
                      : "bg-main-hover"
                  )}
                >
                  <ListItemIcon>
                    <item.icon
                      className={classNames(
                        item.href === pathNameWithoutLand
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
