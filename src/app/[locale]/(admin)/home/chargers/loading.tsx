import PageLoader from "@/components/ui/loaders/PageLoader";
import SuspenseTable from "@/components/suspenseSkeleton/SuspenseTable";
import SuspenseBreadCrumbs from "@/components/suspenseSkeleton/SuspenseBreadCrumbs";
import SuspenseFileUpload from "@/components/suspenseSkeleton/SuspenseFileUpload";

export default function Loading() {
  // Or a custom loading skeleton component
  // return <PageLoader />;
  return (
    <>
      <SuspenseBreadCrumbs />
      <SuspenseFileUpload />
      <SuspenseTable />
    </>
  );
}
