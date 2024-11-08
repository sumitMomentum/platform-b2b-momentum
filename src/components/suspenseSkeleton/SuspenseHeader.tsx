import React from "react";
import { Skeleton } from "@mui/material";

const suspenseHeader = () => {
  return (
    <div>
      <Skeleton animation="wave" width={40} height={30} style={{ display: 'inline-block', marginRight: 8 }} />
      <Skeleton animation="wave" width={70} height={30} style={{ display: 'inline-block', marginRight: 8 }} />
      <Skeleton animation="wave" width={170} height={60} />
    </div>
  );
};

export default suspenseHeader;
