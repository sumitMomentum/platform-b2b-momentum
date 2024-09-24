import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales } from "./i18n";

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: "en",
  alternateLinks: true,
});

export default authMiddleware({
  publicRoutes: [
    "/",
    "/test",
    "/api/clerk",
    "/api/enode",
    "/api/stripe",
    "/api/test",
    "/api/cron",
    "/api/charging",
    "/api/vehicle/onboard",
    "/api/vehicle/update",
    "/api/vehicleStep",
    "/api/vehicleStep/onboard",
    "/api/vehicleStep/update",
    "/api/vehicleStep/step",
    "/api/vehicleStep/step2",
    "/api/vehicleStep/step3",
    "/api/vehicleStep/step7",
    "/api/vehicleStep/allVehicleDetails",
    "/api/vehicleStep/step",
    "/:locale",
    "/:locale/api/clerk",
    "/:locale/api/stripe",
    "/:locale/api/enode",
    "/:locale/sign-in",
    "/:locale/api/charging",
    "/:locale/api/vehicle/onboard",
    "/:locale/api/vehicle/update",
    "/:locale/api/vehicleStep",
    "/:locale/api/vehicleStep/onboard",
    "/:locale/api/vehicleStep/update",
    "/:locale/api/vehicleStep/step",
    "/:locale/api/vehicleStep/step2",
    "/:locale/api/vehicleStep/step3",
    "/:locale/api/vehicleStep/step7",
    "/:locale/api/vehicleStep/allVehicleDetails",
    "/:locale/api/vehicleStep/step",
  ],
  beforeAuth(request) {
    return intlMiddleware(request);
  },
  afterAuth(auth, req) {
    const url = req.nextUrl;
    let hostname = req.headers
      .get("host")!
      .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
    const { userId, sessionClaims, orgId } = auth;
    console.log("userid ",userId,"Session claims",sessionClaims, "Org Id",orgId );
    
    // For user visiting /onboarding, don't try and redirect
    if (userId && req.nextUrl.pathname.includes("onboarding") && !auth.isPublicRoute) {
      return NextResponse.next();
    }

    // User isn't signed in and the route is private -- redirect to sign-in
    if (!userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
      

    // Catch users who doesn't have `onboardingComplete: true` in PublicMetata
    // Redirect them to the /onboading out to complete onboarding
    if (userId && !orgId && !sessionClaims?.metadata?.onboardingComplete && !auth.isPublicRoute) {
      const onboardingUrl = new URL("/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }

    // User is logged in and the route is protected - let them view.
    if (userId && !auth.isPublicRoute) return NextResponse.next();

    // If the route is public, anyone can view it.
    if (auth.isPublicRoute) return NextResponse.next();

    const searchParams = req.nextUrl.searchParams.toString();
    // Get the pathname of the request (e.g. /, /about, /blog/first-post)
    const path = `${url.pathname}${
      searchParams.length > 0 ? `?${searchParams}` : ""
    }`;

    // rewrite root application to `/home` folder
    if (
      hostname === "localhost:3000" ||
      hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
    ) {
      return NextResponse.next();
    }

    // rewrite everything else to `/[domain]/[slug] dynamic route
    return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
    // Allow users visiting public routes to access them
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
