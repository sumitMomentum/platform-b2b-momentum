"use client"

import PageName from "@/components/ui/commons/PageName";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import ActionListComponent from '../ActionListComponent';
import Button from '@mui/material/Button';
import Link from 'next/link';
import Box from '@mui/material/Box';

const ActionCentre = () => {
  const t = useTranslations("AdminLayout.pages.actionCentre");

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
        <Link href="/home/actionCentre" passHref>
          <Button variant="contained" color="primary">
            View Graphically
          </Button>
        </Link>
      </Box>
      <ActionListComponent />
    </div>
  );
};

export default ActionCentre;
