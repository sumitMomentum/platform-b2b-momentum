import React from "react";
import { Skeleton } from "@mui/material";

const TableLoaderSkeleton = ({ count }: { count: number }) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div key={index} className="flex my-3 space-x-4">
      <Skeleton variant="rectangular" width="25%" height={16} />
      <Skeleton variant="rectangular" width="25%" height={16} />
      <Skeleton variant="rectangular" width="75%" height={16} />
      <Skeleton variant="rectangular" width="25%" height={16} />
      <Skeleton variant="rectangular" width="50%" height={16} />
    </div>
  ));

  return <div>{skeletons}</div>;
};

export default TableLoaderSkeleton;
