// 'use client';

// import { VendorStatus } from '@prisma/client';
// import { Select } from '@radix-ui/themes';
// import { useRouter, useSearchParams } from 'next/navigation';
// import React from 'react';

// const statuses: { label: string; value?: VendorStatus }[] = [
//   { label: 'Ready', value: 'READY' },
//   { label: 'Elevated error rate', value: 'ELEVATED_ERROR_RATE' },
//   { label: 'Outage', value: 'OUTAGE' },
// ];

// const VendorStatusFilter = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   return (
//     <Select.Root
//       defaultValue={searchParams.get('status') || ''}
//       onValueChange={(status) => {
//         const params = new URLSearchParams();
//         if (status) params.append('status', status);
//         if (searchParams.get('orderBy'))
//           params.append('orderBy', searchParams.get('orderBy')!);

//         const query = params.size ? '?' + params.toString() : '';
//         router.push('/vendors/list' + query);
//       }}
//     >
//       <Select.Trigger placeholder="Filter by status..." />
//       <Select.Content>
//         {statuses.map((status) => (
//           <Select.Item
//             key={status.value}
//             value={status.value || ''}
//           >
//             {status.label}
//           </Select.Item>
//         ))}
//       </Select.Content>
//     </Select.Root>
//   );
// };

// export default VendorStatusFilter;