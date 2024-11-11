import PageLoader from "@/components/ui/loaders/PageLoader";
import SuspenseDashboard from "@/components/suspenseSkeleton/SuspenseDashboard";

export default function Loading() {
    // Or a custom loading skeleton component
    // return <PageLoader />;
    return <SuspenseDashboard />;
  }
  