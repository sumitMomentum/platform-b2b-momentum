import PageName from "@/components/ui/commons/PageName";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import React from "react";
import ActionListComponent from './ActionListComponent';
import { ActionItem } from "@/types"; // Assuming you have defined ActionItem type in a separate file
import { getAllVehicleActions } from "@/actions/admin/actionCenterModule/getAllVehicleActions";

const ActionCentre = async () => {
  const t = await getTranslations("AdminLayout.pages.actionCentre");

  const actionItems: ActionItem[] = await getAllVehicleActions();

  return (
    <div>
      <PageName
        name={t("title")}
        breadcrumbs={[
          { name: "Home", href: "/home" },
          { name: "Action Centre", href: "/home/actionCentre" },
        ]}
      />
        <ActionListComponent initialActionItems={actionItems} />
    </div>
  );
};

export default ActionCentre;
