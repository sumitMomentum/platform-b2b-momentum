// import  VendorStatusBadge  from '@/components/core/VendorStatusBadge'
// import { ArrowUpIcon } from '@radix-ui/react-icons'
// import { Table } from '@radix-ui/themes'
// import Link from 'next/link'
// import React from 'react'
// import NextLink from 'next/link';
// import {  VendorData,VendorStatus } from '@prisma/client'


// export interface VendorQuery {
//   status: VendorStatus;
//   orderBy: keyof VendorData;
//   page: string;
// }

// interface Props { 
//   searchParams: VendorQuery,
//   vendors: VendorData[]
// }

// const VendorTable = ({ searchParams, vendors }: Props) => {

//   return (
//     <Table.Root variant="surface">
//         <Table.Header>
//           <Table.Row>
//             {columns.map((column) => (
//               <Table.ColumnHeaderCell
//                 key={column.value}
//                 className={column.className}
//               >
//                 <NextLink
//                   href={{
//                     query: {
//                       ...searchParams,
//                       orderBy: column.value,
//                     },
//                   }}
//                 >
//                   {column.label}
//                 </NextLink>
//                 {column.value === searchParams.orderBy && (
//                   <ArrowUpIcon className="inline" />
//                 )}
//               </Table.ColumnHeaderCell>
//             ))}
//           </Table.Row>
//         </Table.Header>
//         <Table.Body>
//           {vendors.map((vendor) => (
//             <Table.Row key={vendor.vendor}>
//               <Table.Cell>
//                 <Link href={`/vendors/${vendor.vendor}`}>
//                   {vendor.displayName}
//                 </Link>
//                 <div className="block md:hidden">
//                   <VendorStatusBadge status={vendor.status} />
//                 </div>
//               </Table.Cell>
//               <Table.Cell className="hidden md:table-cell">
//                 <VendorStatusBadge status={vendor.status} />
//               </Table.Cell>
//               <Table.Cell className="hidden md:table-cell">
//                 {vendor.linkingStatus}
//               </Table.Cell>
//             </Table.Row>
//           ))}
//         </Table.Body>
//       </Table.Root>
//   )
// }

// const columns: {
//   label: string;
//   value: keyof VendorData;
//   className?: string;
// }[] = [
//   { label: 'Vendor', value: 'displayName' },
//   {
//     label: 'Status',
//     value: 'status',
//     className: 'hidden md:table-cell',
//   },
//   {
//     label: 'LinkingStatus',
//     value: 'linkingStatus',
//     className: 'hidden md:table-cell',
//   },
// ];

// export const columnNames = columns.map(column => column.value);


// export default VendorTable