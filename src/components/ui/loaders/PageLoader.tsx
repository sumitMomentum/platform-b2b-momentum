import { ChevronRightIcon } from "@heroicons/react/24/outline";
import React from "react";
import TableLoaderSkeleton from "./TableLoaderSkeleton";
import { Skeleton } from "@mui/material";

const PageLoader = () => (
  <div className="w-full">
    <div className="flex justify-between">
      <div className="flex flex-col my-2 space-y-1">
        <Skeleton variant="text" width={192} height={28} />
        <div className="flex space-x-3 py-3">
          <Skeleton variant="rectangular" width={56} height={28} />
          <ChevronRightIcon
            className="w-5 bg-gray-300 rounded-xl text-gray-100"
            aria-hidden="true"
          />
          <Skeleton variant="rectangular" width={56} height={28} />
          <ChevronRightIcon
            className="w-5 bg-gray-300 rounded-xl text-gray-100"
            aria-hidden="true"
          />
          <Skeleton variant="rectangular" width={56} height={28} />
        </div>
      </div>
      <div className="flex space-x-3">
        <Skeleton variant="rectangular" width={128} height={40} />
      </div>
    </div>
    <hr className="mb-1" />
    <div className="flex space-x-3 py-3">
      <Skeleton variant="rectangular" width={128} height={28} />
      <Skeleton variant="rectangular" width={128} height={28} />
      <Skeleton variant="rectangular" width={128} height={28} />
    </div>
    <hr className="mb-1" />
    <TableLoaderSkeleton count={10} />
  </div>
);

export default PageLoader;
