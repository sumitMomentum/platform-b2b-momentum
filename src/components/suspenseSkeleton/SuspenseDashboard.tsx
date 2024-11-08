import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import SuspenseHeader from "./SuspenseHeader";

export default function SuspenseDashboard() {
  return (
    <div>
      <SuspenseHeader />
      <div className="flex gap-6 w-full justify-center items-center pt-2">
        <div className="flex gap-6 flex-col w-full">
          <div className="grid grid-cols-1 gap-6 w-full sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
            <Skeleton variant="rectangular" width="100%" height={300} />
            <Skeleton variant="rectangular" width="100%" height={300} />
            <Skeleton variant="rectangular" width="100%" height={300} />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
            <Skeleton variant="rectangular" width="100%" height={400} />
            <Skeleton variant="rectangular" width="100%" height={400} />
          </div>
        </div>
      </div>
    </div>
  );
}
