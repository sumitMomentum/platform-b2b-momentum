import PageName from "@/components/ui/commons/PageName";
import { Metadata } from "next";
import NotificationsList from "./ui/NotificationsList";

export const metadata: Metadata = {
  title: "Notificaciones",
};

const NotificationsPage = async (
  props: {
    searchParams?: Promise<{
      query?: string;
      page?: string;
      paymentStatus?: string;
    }>;
  }
) => {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const query = searchParams?.query || "";

  return (
    <div>
      <PageName name={"Notificaciones"} />
      <NotificationsList query={query} currentPage={currentPage} />
    </div>
  );
};

export default NotificationsPage;
