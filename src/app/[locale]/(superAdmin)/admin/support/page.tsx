import PageName from "@/components/ui/commons/PageName";
import React, { Suspense } from "react";
import { Metadata } from "next";
import Search from "@/components/ui/commons/Search";
import TableLoaderSkeleton from "@/components/ui/loaders/TableLoaderSkeleton";
import SuperAdminTicketsList from "./ui/SuperAdminTicketsList";

export const metadata: Metadata = {
  title: "Support",
};

const SuperAdminSupportPage = async (
  props: {
    searchParams?: Promise<{
      query?: string;
      page?: string;
    }>;
  }
) => {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const query = searchParams?.query || "";

  return (
    <div>
      <PageName
        name={"Support"}
        breadcrumbs={[
          { name: "Dashboard", href: "/admin" },
          { name: "Support", href: "/admin/support" },
        ]}
      />
      <Search placeholder="Search for ticket ID, user name, organization or subject" />
      {/* <Suspense
        key={query + Math.random}
        fallback={<TableLoaderSkeleton count={10} />}
      > */}
        <SuperAdminTicketsList query={query} currentPage={currentPage} />
      {/* </Suspense> */}
    </div>
  );
};

export default SuperAdminSupportPage;
