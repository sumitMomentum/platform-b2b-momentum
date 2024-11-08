import AdminHeader from "../ui/AdminHeader";
import { ReactNode, Suspense } from "react";
import AdminSidebar from "../ui/AdminSidebar";
import { getUserNotificationsUnreadCount } from "@/actions/global/notificationsModule/get-user-notifications";
import FloatingWhatsAppButton from "../core/FloatingWhatsAppButton";
import SuspenseTable from "../suspenseSkeleton/SuspenseTable";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const notificationsCount = await getUserNotificationsUnreadCount();

  return (
    <main className="relative text-primary">
      <AdminSidebar />{" "}
      <div className="lg:pl-72 h-screen overflow-y-auto relative bg-main">
        <AdminHeader notificationsCount={notificationsCount} />
        <div className="py-3  ">
          <div className="mx-auto   px-4  ">{children}</div>
        </div>
      </div>{" "}
      {/* <FloatingWhatsAppButton /> */}
    </main>
  );
}
