import PageName from "@/components/ui/commons/PageName";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import BenefitsListComponent from "./BenefitsListComponent";
import Button from '@mui/material/Button';
import Link from 'next/link';
import Box from '@mui/material/Box';

const Page = async () => {
  // const t = await getTranslations("AdminLayout.pages.benefits");

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <PageName
          name={("Benefits")}
          breadcrumbs={[
            { name: "Home", href: "/home" }, 
            { name: "Benefits", href: "/home/benefits" },
          ]}
        />
        <Link href="/home/benefits/dashboard" passHref>
          <Button variant="contained" color="primary">
            View Graphically
          </Button>
        </Link>
      </Box>
      <BenefitsListComponent />
      {/* <BenefitsGraphComponent /> */}
    </div>
  );
};

export default Page;
