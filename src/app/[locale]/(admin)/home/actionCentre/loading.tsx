import PageLoader from "@/components/ui/loaders/PageLoader";
import SuspenseTable from "@/components/suspenseSkeleton/suspenseTable";
import SuspenseHeader from "@/components/suspenseSkeleton/suspenseHeader";

export default function Loading() {
  // Or a custom loading skeleton component
  // return <PageLoader />;
  return (
    <>
      <SuspenseHeader /> <SuspenseTable />
    </>
  );
}
