import PageLoader from "@/components/ui/loaders/PageLoader";
import SuspenseTable from "@/components/suspenseSkeleton/SuspenseTable";
import SuspenseBreadCrumbs from "@/components/suspenseSkeleton/SuspenseBreadCrumbs";

export default function Loading() {
  // Or a custom loading skeleton component
  // return <PageLoader />;
  return (
    <>
      <SuspenseBreadCrumbs /> <SuspenseTable />
    </>
  );
}
