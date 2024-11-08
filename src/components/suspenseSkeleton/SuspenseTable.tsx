import React from 'react';
import { Skeleton } from '@mui/material';

const SuspenseTable = () => (
  <div style={{ padding: '20px' }}>
    <Skeleton variant="rectangular" width="100%" height={60} />
    <Skeleton variant="rectangular" width="100%" height={60} style={{ marginTop: '10px' }} />
    <Skeleton variant="rectangular" width="100%" height={60} style={{ marginTop: '10px' }} />
    <Skeleton variant="rectangular" width="100%" height={60} style={{ marginTop: '10px' }} />
    <Skeleton variant="rectangular" width="100%" height={60} style={{ marginTop: '10px' }} />
  </div>
);

export default SuspenseTable;
