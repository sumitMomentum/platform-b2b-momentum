import PageLoader from "@/components/ui/loaders/PageLoader";
import SuspenseTable from "@/components/suspenseSkeleton/SuspenseTable";
import SuspenseHeader from "@/components/suspenseSkeleton/SuspenseHeader";

export default function Loading() {
  // Or a custom loading skeleton component
  // return <PageLoader />;
  return (
    <>
      <SuspenseHeader /> <SuspenseTable />
    </>
  );
}
