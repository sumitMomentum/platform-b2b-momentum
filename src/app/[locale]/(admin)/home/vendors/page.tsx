import Pagination from '@/components/core/Pagination';
import "@radix-ui/themes/styles.css";
import { Theme, Container } from '@radix-ui/themes'
import { Status } from '@prisma/client';
// import VendorActions from './VendorActions';
// import VendorTable, { VendorQuery } from './VendorTable';
import { Flex } from '@radix-ui/themes';
import { Metadata } from 'next';




const VendorsPage = async () => {
//   const statuses = Object.values(Status);
//   // const status = statuses.includes(searchParams.status)
//   //   ? searchParams.status
//   //   : undefined;
//   // const where = { status };

//   // const orderBy = columnNames
//   //   .includes(searchParams.orderBy)
//   //   ? { [searchParams.orderBy]: 'asc' }
//   //   : undefined;

//   // const page = parseInt(searchParams.page) || 1;
//   const page = 1;
//   const pageSize = 10;
//   const vendors = await prisma.vendorData.findMany();
//   // const vendors = [
//   //   {
//   //     "vendor": "TESLA",
//   //     "displayName": "Tesla",
//   //     "portalName": "Tesla",
//   //     "status": "READY",
//   //     "linkingStatus": "READY"
//   //   },
//   //   {
//   //     "vendor": "BMW",
//   //     "displayName": "BMW",
//   //     "portalName": "My BMW",
//   //     "status": "READY",
//   //     "linkingStatus": "READY"
//   //   },
//   //   {
//   //     "vendor": "AUDI",
//   //     "displayName": "Audi",
//   //     "portalName": "myAudi",
//   //     "status": "READY",
//   //     "linkingStatus": "READY"
//   //   }
//   // ];

//   const VendorCount = await prisma.vendorData.count();

  return (

    <Theme accentColor="violet">

      <Container>
        <Flex direction="column" gap="3">
          {/* <VendorActions />
          <VendorTable searchParams={searchParams} vendors={vendors} />
          <Pagination
            pageSize={pageSize}
            currentPage={page}
            itemCount={VendorCount}
          /> */}
        </Flex>
      </Container>
    </Theme>
  );
};

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Vendor Tracker - Vendor List',
  description: 'View all organisation Vendors'
};

 export default VendorsPage;