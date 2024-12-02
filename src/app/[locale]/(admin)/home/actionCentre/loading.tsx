import SuspenseBreadCrumbs from "@/components/suspenseSkeleton/SuspenseBreadCrumbs";
import SuspenseChartGrid from "@/components/suspenseSkeleton/SuspenseChartGrid";
import SuspenseTable from "@/components/suspenseSkeleton/SuspenseTable";
import SuspenseViewChange from "@/components/suspenseSkeleton/SuspenseViewChange";
import React from "react";

function loading() {
  return (
    <>
      <SuspenseBreadCrumbs />
      <SuspenseViewChange />
      <SuspenseChartGrid />
    </>
  );
}

export default loading;
