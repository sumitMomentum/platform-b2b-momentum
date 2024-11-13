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
  RocketLaunchIcon
} from "@heroicons/react/24/outline";

import { useTranslations } from "next-intl";

export const useNavigation = () => {
  const t = useTranslations("AdminLayout.navigation");
  const tSuperAmin = useTranslations("SuperAdminLayout.navigation");

  const adminNavigation = [
    {
      sectionName: t("general"),
      items: [
        { name: t("dashboard"), href: "/home", icon: HomeIcon, current: true },
        {
          name: t("vehicles"),
          href: "/home/vehicles/list",
          icon: TruckIcon,
          current: true,
        },
        {
          name: t("actionCentre"),
          href: "/home/actionCentre",
          icon: TicketIcon,
          current: true,
        },
        {
          name: t("benefits"),
          href: "/home/benefits",
          icon: StarIcon,
          current: true,
        },
        {
          name: t("chargers"),
          href: "/home/chargers",
          icon: BoltIcon,
          current: true,
        },
        {
          name: t("scheduling"),
          href: "/home/scheduling",
          icon: CalendarDateRangeIcon,
          current: true,
        },
        {
          name: "Charging Sessions",
          href: "/home/chargingSessions",
          icon: Battery50Icon,
          current: true,
        },
        {
          name: "Trip Sessions",
          href: "/home/tripSessions",
          icon: RocketLaunchIcon,
          current: true,
        },
      ],
    },
    // {
    //   sectionName: t("examples"),
    //   items: [
    //     {
    //       name: t("exampleOne"),
    //       href: "/home/examples",
    //       icon: ShoppingBagIcon,
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
    //       icon: CreditCardIcon,
    //       current: true,
    //     },
    //     {
    //       name: t("invoices"),
    //       href: "/home/invoices",
    //       icon: DocumentTextIcon,
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
          icon: HomeIcon,
          current: true,
        },
        {
          name: tSuperAmin("users"),
          href: "/admin/users",
          icon: UsersIcon,
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
    //       icon: CreditCardIcon,
    //       current: true,
    //     },
    //     {
    //       name: tSuperAmin("suscriptions"),
    //       href: "/admin/billing/subscriptions",
    //       icon: BuildingLibraryIcon,
    //       current: false,
    //     },
    //     {
    //       name: tSuperAmin("invoices"),
    //       href: "/admin/billing/invoices",
    //       icon: DocumentTextIcon,
    //       current: false,
    //     },
    //     {
    //       name: tSuperAmin("coupons"),
    //       href: "/admin/billing/coupons",
    //       icon: TicketIcon,
    //       current: false,
    //     },
    //   ],
    // },
  ];

  return { adminNavigation, superAdminNavigation };
};
