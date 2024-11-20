import PageName from "@/components/ui/commons/PageName";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import React from "react";
import ActionListComponent from './ActionListComponent';

// Define ActionItem type here
type ActionItem = {
  id: number;
  vin: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  bestPractice: string;
  actionToBeTaken: string;
  confirm: boolean;
  CreatedDateTime: string;
  ClosedDateTime?: string;
};

import { getAllVehicleActions } from "@/actions/admin/actionCenterModule/getAllVehicleActions";

const ActionCentre = async () => {
  const t = await getTranslations("AdminLayout.pages.actionCentre");

  // const actionItems: ActionItem[] = await getAllVehicleActions();

  return (
    <div>
      <PageName
        name={t("title")}
        breadcrumbs={[
          { name: "Home", href: "/home" },
          { name: "Action Centre", href: "/home/actionCentre" },
        ]}
      />
      <ActionListComponent />
    </div>
  );
};

export default ActionCentre;
