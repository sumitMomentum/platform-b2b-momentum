import HeroLanding from "@/components/ui/commons/HeroLanding";
import AffiliateHandler from "@/components/core/AffiliateHandler";
import CTAOffer from "@/components/ui/commons/CTAOffer";
import TestimonialMultiple from "./ui/TestimonialMultiple";
import dynamic from "next/dynamic";
import MarketingPage from "@/components/ui/landingPage/MarketingPage";

// const MarketingPage = dynamic(
//   () => import("@/components/ui/landingPage/MarketingPage"),
// );

export default function LandingPage() {
  return <MarketingPage />;
}

// old component
{
  /* <div className="bg-sky-950">
      <HeroLanding />
      <div className="bg-white flex">
        <div className="hidden lg:flex   mx-auto">
          <TestimonialMultiple />
        </div>
      <div>
      <div>
        <div className="  mx-auto">
          <CTAOffer />
        </div>
      </div>{" "} 
       <AffiliateHandler aff={searchParams.aff} currentUser={null} />
    </div> */
}
