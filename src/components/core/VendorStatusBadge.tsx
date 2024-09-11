// import { VendorStatus } from '@prisma/client'
import { Badge } from '@radix-ui/themes'
import { redirect } from 'next/dist/server/api-utils';
import React from 'react'

// const statusMap: Record<
// VendorStatus, 
//   { label: string, color: 'red' | 'violet' | 'green' }
// > = {
//     READY: { label: 'Ready', color: 'green' },
//     ELEVATED_ERROR_RATE: { label: 'Elevated Error Rate', color: 'violet' },
//   OUTAGE: { label: 'Outage', color: 'red' }
// };

 const IssueStatusBadge = () => {
  return (
     <Badge 
     color="red">
     </Badge>
  )
};

export default IssueStatusBadge