import PageName from "@/components/ui/commons/PageName";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import React from "react";

const ActionCentre = async () => {
  const t = await getTranslations("AdminLayout.pages.actionCentre");
  return (
    <div>
      <PageName name={t("title")} breadcrumbs={[
          { name: "Home", href: "/home" },
          { name: "Action Centre", href: "/home/actionCentre" },
        ]}/>
      <div>Action Centre</div>
    </div>
  );
};

export default ActionCentre;
