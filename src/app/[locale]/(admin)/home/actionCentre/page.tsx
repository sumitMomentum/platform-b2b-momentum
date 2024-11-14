import PageName from "@/components/ui/commons/PageName";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import React from "react";
import ActionListComponent from './ActionListComponent';
import Button from '@mui/material/Button';
import Link from 'next/link';
import Box from '@mui/material/Box';

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

  const actionItems: ActionItem[] = await getAllVehicleActions();

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <PageName
          name={t("title")}
          breadcrumbs={[
            { name: "Home", href: "/home" },
            { name: "Action Centre", href: "/home/actionCentre" },
          ]}
        />
        <Link href="/home/actionCentre/dashboard" passHref>
          <Button variant="contained" color="primary">
            View Graphically
          </Button>
        </Link>
      </Box>
      <ActionListComponent initialActionItems={actionItems} />
    </div>
  );
};

export default ActionCentre;
