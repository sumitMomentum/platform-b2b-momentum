import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales } from "./i18n";
import chalk, { blue, cyan, green, magenta, red, yellow } from "chalk";
import { headers } from "next/headers";
import { stringify } from "querystring";
import { error, log } from "console";
import { get } from "http";
import next from "next";
import { redirect } from "next/navigation";
import { env } from "process";
import { metadata } from "./app/[locale]/(landing)/layout";

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: "en",
  alternateLinks: true,
});

// Error handling utility
const handleError = (error: unknown, context: string) => {
  console.error(
    chalk.red(`❌ Error in ${context}:`),
    chalk.red(error instanceof Error ? error.message : String(error))
  );
  // Return a generic error response
  return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
};

export default authMiddleware({
  publicRoutes: [
    "/",
    "/test",
    "/:locale",
    "/:locale/api/clerk",
    "/:locale/api/stripe",
    "/:locale/api/enode",
    "/:locale/sign-in",
    "/:locale/api/vehicle/:vehicleId",
    "/:locale/api/vehicle/trips",
    "/:locale/api/vehicle",
    "/:locale/api/benefits",
    "/:locale/api/charger/sessions",
    "/:locale/api/charger",
    "/:locale/api/vehicleActions",
  ],
  beforeAuth(request) {
    try {
      console.log(chalk.blue("🔄 Running beforeAuth middleware"));
      return intlMiddleware(request);
    } catch (error) {
      return handleError(error, "beforeAuth middleware");
    }
  },
  afterAuth(auth, req) {
    try {
      console.log(chalk.yellow("🔒 Running afterAuth middleware"));

      // Validate required headers
      const host = req.headers.get("host");
      if (!host) {
        console.error(chalk.red("❌ Missing host header"));
        return new NextResponse(JSON.stringify({ error: "Missing host header" }), {
          status: 400,
        });
      }

      const url = req.nextUrl;
      let hostname = host.replace(
        ".localhost:3000",
        `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
      );
      
      if (!process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
        console.error(chalk.red("❌ Missing NEXT_PUBLIC_ROOT_DOMAIN environment variable"));
        return handleError(
          new Error("Missing required environment variable"),
          "environment check"
        );
      }

      const { userId, sessionClaims, orgId } = auth;

      // Debug auth info with validation
      console.log(chalk.cyan("👤 Auth Info:"), {
        userId: userId || "not authenticated",
        sessionClaims: sessionClaims || "no claims",
        orgId: orgId || "no org",
      });

      // Onboarding check
      if (userId && req.nextUrl.pathname.includes("onboarding") && !auth.isPublicRoute) {
        console.log(chalk.green("✅ User accessing onboarding"));
        return NextResponse.next();
      }

      // Not signed in check
      if (!userId && !auth.isPublicRoute) {
        console.log(chalk.red("❌ Unauthorized access - redirecting to sign-in"));
        try {
          return redirectToSignIn({ returnBackUrl: req.url });
        } catch (error) {
          console.error(chalk.red("❌ Error during sign-in redirect:"), error);
          return handleError(error, "sign-in redirect");
        }
      }

      // Incomplete onboarding check with detailed logging
      if (userId && !orgId && !sessionClaims?.metadata?.onboardingComplete && !auth.isPublicRoute) {
        console.log(
          chalk.yellow("⚠️ Onboarding Status:"),
          {
            hasUserId: !!userId,
            hasOrgId: !!orgId,
            onboardingComplete: !!sessionClaims?.metadata?.onboardingComplete,
          }
        );
        console.log(chalk.yellow("⚠️ Redirecting to onboarding"));
        const onboardingUrl = new URL("/onboarding", req.url);
        return NextResponse.redirect(onboardingUrl);
      }

      // Protected route access
      if (userId && !auth.isPublicRoute) {
        console.log(chalk.green("✅ Authorized access to protected route"));
        return NextResponse.next();
      }

      // Public route access
      if (auth.isPublicRoute) {
        console.log(chalk.blue("ℹ️ Accessing public route"));
        return NextResponse.next();
      }

      // URL handling with validation
      const searchParams = req.nextUrl.searchParams.toString();
      const path = `${url.pathname}${
        searchParams.length > 0 ? `?${searchParams}` : ""
      }`;

      // Root domain check
      if (hostname === "localhost:3000" || hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
        console.log(chalk.blue("🏠 Accessing root domain"));
        return NextResponse.next();
      }

      // Subdomain rewrite with validation
      try {
        const rewriteUrl = new URL(`/${hostname}${path}`, req.url);
        console.log(
          chalk.magenta("🔄 Rewriting to subdomain path:", rewriteUrl.toString())
        );
        return NextResponse.rewrite(rewriteUrl);
      } catch (error) {
        console.error(chalk.red("❌ Error creating rewrite URL:"), error);
        return handleError(error, "URL rewrite");
      }
    } catch (error) {
      return handleError(error, "afterAuth middleware");
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
