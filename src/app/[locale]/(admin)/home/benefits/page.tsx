import PageName from "@/components/ui/commons/PageName";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import BenefitsListComponent from "./BenefitsListComponent";

const Page = async () => {
  // const t = await getTranslations("AdminLayout.pages.benefits");

  return (
    <div>
      <PageName
        name={("Benefits")}
        breadcrumbs={[
          { name: "Home", href: "/home" },
          { name: "Benefits", href: "/home/benefits" },
        ]}
      />
      <BenefitsListComponent />
      {/* <BenefitsGraphComponent /> */}
    </div>
  );
};

export default Page;
