import {
  CreditCardIcon,
  DocumentTextIcon,
  HomeIcon,
  ShoppingBagIcon,
  BuildingLibraryIcon,
  TicketIcon,
  UsersIcon,
  TruckIcon,
  BoltIcon,
  StarIcon,
  CalendarDateRangeIcon,
  Battery50Icon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";

import { useTranslations } from "next-intl";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ElectricCarIcon from "@mui/icons-material/ElectricCar";
import EvStationIcon from "@mui/icons-material/EvStation";
import SmartButtonIcon from "@mui/icons-material/SmartButton";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ModeOfTravelIcon from "@mui/icons-material/ModeOfTravel";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import GroupIcon from "@mui/icons-material/Group";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

export const useNavigation = () => {
  const t = useTranslations("AdminLayout.navigation");
  const tSuperAmin = useTranslations("SuperAdminLayout.navigation");

  const adminNavigation = [
    {
      sectionName: t("general"),
      items: [
        {
          name: t("dashboard"),
          href: "/home",
          icon: <DashboardIcon />,
          current: false,
        },
        {
          name: t("vehicles"),
          href: "/home/vehicles/list",
          icon: <ElectricCarIcon />,
          current: false,
        },
        {
          name: t("actionCentre"),
          href: "/home/actionCentre",
          icon: <SmartButtonIcon />,
          current: false,
        },
        {
          name: t("benefits"),
          href: "/home/benefits",
          icon: <MonetizationOnIcon />,
          current: false,
        },
        {
          name: t("chargers"),
          href: "/home/chargers",
          icon: <EvStationIcon />,
          current: false,
        },
        {
          name: t("scheduling"),
          href: "/home/scheduling",
          icon: <DateRangeIcon />,
          current: false,
        },
        {
          name: "Charging Sessions",
          href: "/home/chargingSessions",
          icon: <ElectricalServicesIcon />,
          current: false,
        },
        {
          name: "Trip Sessions",
          href: "/home/tripSessions",
          icon: <ModeOfTravelIcon />,
          current: false,
        },
      ],
    },
    // {
    //   sectionName: t("examples"),
    //   items: [
    //     {
    //       name: t("exampleOne"),
    //       href: "/home/examples",
    //       icon: <ShoppingBagIcon/>,
    //       current: false,
    //     },
    //   ],
    // },
    // {
    //   sectionName: t("billing"),
    //   items: [
    //     {
    //       name: t("wallet"),
    //       href: "/home/wallet?currency=usd",
    //       icon: <CreditCardIcon/>,
    //       current: true,
    //     },
    //     {
    //       name: t("invoices"),
    //       href: "/home/invoices",
    //       icon: <DocumentTextIcon/>,
    //       current: true,
    //     },
    //   ],
    // },
  ];
  const superAdminNavigation = [
    {
      sectionName: tSuperAmin("general"),
      items: [
        {
          name: tSuperAmin("dashboard"),
          href: "/admin",
          icon: <DashboardIcon />,
          current: true,
        },
        {
          name: tSuperAmin("users"),
          href: "/admin/users",
          icon: <GroupIcon />,
          current: false,
        },
      ],
    },
    // {
    //   sectionName: tSuperAmin("billing"),
    //   items: [
    //     {
    //       name: tSuperAmin("plans"),
    //       href: "/admin/billing/plans/plans",
    //       icon: <CreditCardIcon/>,
    //       current: true,
    //     },
    //     {
    //       name: tSuperAmin("suscriptions"),
    //       href: "/admin/billing/subscriptions",
    //       icon: <CardMembershipIcon/>,
    //       current: false,
    //     },
    //     {
    //       name: tSuperAmin("invoices"),
    //       href: "/admin/billing/invoices",
    //       icon: <ConfirmationNumberIcon/>,
    //       current: false,
    //     },
    //     {
    //       name: tSuperAmin("coupons"),
    //       href: "/admin/billing/coupons",
    //       icon: <TicketIcon/>,
    //       current: false,
    //     },
    //   ],
    // },
  ];

  return { adminNavigation, superAdminNavigation };
};
