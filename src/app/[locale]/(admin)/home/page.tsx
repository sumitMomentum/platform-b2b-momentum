"use client";

import React, { createContext, Suspense, useEffect, useState } from "react";
import { LifebuoyIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { classNames } from "@/utils/facades/serverFacades/strFacade";
import PageName from "@/components/ui/commons/PageName";
import { Card, Flex, Metric, Text } from "@tremor/react";
import Link from "next/link";
import { getUserInvoicesPendingCount } from "@/actions/superAdmin/superAdminBillingModule/admin/get-user-invoices";
import PageLoader from "@/components/ui/loaders/PageLoader";
import { getSupportTicketsActivesCount } from "@/actions/global/supportModule/admin/get-user-support-tickets";
import AffiliateHandler from "@/components/core/AffiliateHandler";
import { getUserDB } from "@/actions/admin/userModule/get-user-DB";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AllVehicle from "@/components/ui/dashboard/aggregatedDashboard/AllVehicle";
import VehicleStatus from "@/components/ui/dashboard/aggregatedDashboard/VehicleStatus";
import Condition from "@/components/ui/dashboard/aggregatedDashboard/Condition";
import DistanceTravelled from "@/components/ui/dashboard/aggregatedDashboard/DistanceTravelled";
import BatteryHealth from "@/components/ui/dashboard/aggregatedDashboard/BatteryHealth";
import { createEnodeWebhook } from "@/actions/admin/dashboardModule/create-enode-webhook";
import { getUserVehicleEnode } from "@/actions/admin/userModule/get-user-vehicle-enode";
import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";
import useVehicleStore from "@/states/store";
import loading from "./actionCentre/loading";
import SuspenseDashboard from "@/components/suspenseSkeleton/SuspenseDashboard";



const SuperAdminDashboardPage = () => {
  // const t = await getTranslations("AdminLayout.pages.dashboard");
  const [invoicesCount, setInvoicesCount] = useState(0);
  const [supportTicketsCounts, setSupportTicketsCounts] = useState(0);
  const [user, setUser] = useState(null);
  const [enodeWebhook, setEnodeWebhook] = useState(null);
  const [loading, setLoading] = useState(true);
  const vehicles = useVehicleStore((state) => state.vehicles);
  const setVehicles = useVehicleStore((state) => state.setVehicles);
  const [enodeVehicles, setEnodeVehicles] = useState([]);
  const setSelectedVehicleId = useVehicleStore(
    (state) => state.setSelectedVehicleId
  );

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  useEffect(() => {
    const fetchData = async () => {
      const invoices = await getUserInvoicesPendingCount();
      const supportTickets = await getSupportTicketsActivesCount();
      const userData = await getUserDB();
      const enodeWebhook = await createEnodeWebhook();
      setInvoicesCount(invoices);
      setSupportTicketsCounts(supportTickets);
      setUser(userData);
      stopLoading();
      setEnodeWebhook(enodeWebhook);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getVehicles = async () => {
      if (!vehicles || vehicles.length === 0) {
        const userVehiclesFromDB = await getUserVehicles();
        setVehicles(userVehiclesFromDB);
        setSelectedVehicleId("");
      }
      setLoading(false);
    };

    getVehicles();
  }, [vehicles]);

  const actions = [
    {
      title: "actionOne",
      href: "/home/services/buy-service",
      icon: ShoppingBagIcon,
      iconForeground: "text-teal-700",
      description: "actionOneDescription",
      iconBackground: "bg-teal-50",
    },
    {
      title: "actionTwo",
      href: "/home/support",
      icon: LifebuoyIcon,
      iconForeground: "text-purple-700",
      iconBackground: "bg-purple-50",
      description: "actionTwoDescription",
    },
  ];

  //just for now, after fetch vehicle array from store
  const vehiclesFromStore = true;

  return loading ? (
    <div>
      <SuspenseDashboard />
    </div>
  ) : (
    <div>
      <PageName
        name={"Dashboard"}
        breadcrumbs={[
          { name: "Home", href: "/home" },
          { name: "", href: "/home" },
        ]}
      />
      {/* <Suspense fallback={<PageLoader />}>
        <Card className=" my-7">
          <Flex>
            <div>
              <Link href={"/home/services"}>
                <Text color="sky">{"eampleActive")}</Text>
              </Link>
              <Metric> 3 </Metric>{" "}
            </div>
            <div>
              <Link href={"/home/invoices"}>
                <Text color="sky"> {"ivoicesInPaid")}</Text>
              </Link>
              <Metric>{invoicesCount}</Metric>
            </div>
            <div>
              <Link href={"/home/support"}>
                <Text color="sky">{"tckersActives")}</Text>
              </Link>
              <Metric>{supportTicketsCounts}</Metric>
            </div>
          </Flex>
        </Card>
        <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-main shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
          {actions.map((action, actionIdx) => (
            <div
              key={action.title}
              className={classNames(
                actionIdx === 0
                  ? "rounded-tl-lg rounded-tr-lg sm:rounded-tr-none"
                  : "",
                actionIdx === 1 ? "sm:rounded-tr-lg" : "",
                actionIdx === actions.length - 2 ? "sm:rounded-bl-lg" : "",
                actionIdx === actions.length - 1
                  ? "rounded-bl-lg rounded-br-lg sm:rounded-bl-none"
                  : "",
                "group relative bg-main p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
              )}
            >
              <div>
                <span
                  className={classNames(
                    action.iconBackground,
                    action.iconForeground,
                    "inline-flex rounded-lg p-3 ring-4 ring-white"
                  )}
                >
                  <action.icon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-base font-semibold leading-6 text-primary">
                  <a href={action.href} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {action.title}
                  </a>
                </h3>
                <p className="mt-2 text-sm text-primary">
                  {action.description}
                </p>
              </div>
              <span
                className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </Suspense> */}

      <AffiliateHandler aff={null} currentUser={user} />
      <div className="flex gap-6 w-full justify-center items-center pt-2">
        {vehiclesFromStore ? (
          <div className="flex gap-6 flex-col w-full">
            {/* <div className="flex gap-6"> */}
            {/* <InfoCard
                titleKey="hello"
                descriptionKey="description"
                icon={LinkIcon}
              />
              <InfoCard
                titleKey="hello"
                descriptionKey="description"
                icon={LinkIcon}
              />
              <InfoCard
                titleKey="hello"
                descriptionKey="description"
                icon={LinkIcon}
              />
              <InfoCard
                titleKey="hello"
                descriptionKey="description"
                icon={LinkIcon}
              /> */}
            {/* </div> */}
            <div className="grid grid-cols-1 gap-6 w-full sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
              <AllVehicle />
              <VehicleStatus />
              <Condition />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
              {/* Second row with 2 columns */}
              <DistanceTravelled />
              <BatteryHealth />
            </div>

            {/* <div className="flex gap-6 w-full">
               <AddVehicle /> 
              <AllVehicle />
              <VehicleStatus />
              <Condition />
            </div>
            <div className="flex gap-6">
              <DistanceTravelled />
              <BatteryHealth />
            </div> */}

            {/* <div className="flex gap-6">
              <InfoCard
                titleKey="hello"
                descriptionKey="description"
                icon={LinkIcon}
              />
              <InfoCard
                titleKey="hello"
                descriptionKey="description"
                icon={LinkIcon}
              />
            </div> */}
          </div>
        ) : (
          <div className="flex justify-center items-center w-full h-full">
            Please select a vehicle
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboardPage;
