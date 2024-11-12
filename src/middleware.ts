import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { defaultLocale, localePrefix, locales } from "./i18n";
import chalk, {
  cyan,
  green,
  greenBright,
  magenta,
  red,
  redBright,
  yellow,
  yellowBright,
} from "chalk";
chalk.level = 3;
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { get } from "http";
import { headers } from "next/headers";

/**
 * Internationalization middleware configuration
 * Handles locale detection, routing, and alternate language links
 * @see https://next-intl-docs.vercel.app/docs/routing/middleware
 */
// const createLocaleRoutingMiddleware = createMiddleware(routing);
const createLocaleRoutingMiddleware = createMiddleware({
  // Supported locales configuration
  locales: locales,
  // Default locale when no locale is detected
  defaultLocale: "en",
  // Enable generation of alternate language links
  alternateLinks: true,
  // Optional: Locale prefix mode
  localePrefix: "always",
  // Optional: Custom locale detection from different sources
  localeDetection: true,
});

// You would typically fetch these keys from a external store or environment variables.
// const tenantKeys = {
//   tenant1: { publishableKey: 'pk_tenant1...', secretKey: 'sk_tenant1...' },
//   tenant2: { publishableKey: 'pk_tenant2...', secretKey: 'sk_tenant2...' },
// }

const handleInternationalization = async (request: NextRequest) => {
  console.log(chalk.cyan("🔄 Applying internationalization middleware..."));

  const intlResponse = createLocaleRoutingMiddleware(request);

  if (intlResponse instanceof NextResponse) {
    return intlResponse;
  }

  console.log(chalk.green("✅ Internationalization middleware complete"));
  return null;
};

const validateRequest = async (request: NextRequest) => {
  console.log(chalk.yellow("🔍 Validating request headers..."));
  console.log(request.headers);

  const host = await (await request.headers).get("host");
  if (!host) {
    console.warn(chalk.redBright("❌ Missing host header"));
    return new NextResponse(JSON.stringify({ error: "Missing host header" }), {
      status: 400,
    });
  }

  if (!process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    console.warn(
      chalk.redBright("❌ Missing NEXT_PUBLIC_ROOT_DOMAIN environment variable")
    );
    return handleMiddlewareError(
      new Error("Missing required environment variable"),
      "environment check"
    );
  }

  return null;
};

const handleAuthentication = async (
  auth: any,
  request: NextRequest,
  userId: string | null,
  orgId: string | null,
  sessionClaims: any
) => {
  // Handle onboarding route access
  if (
    userId &&
    request.nextUrl.pathname.includes("onboarding") &&
    isPublicRoute(request)
  ) {
    console.log(chalk.greenBright("✅ User accessing onboarding"));
    return NextResponse.next();
  }

  // Handle unauthenticated access to protected routes
  if (!userId && !isPublicRoute(request)) {
    try {
      console.log(
        chalk.yellowBright("⚠️ Unauthorized access - redirecting to sign-in")
      );
      return auth.redirectToSignIn({ returnBackUrl: request.url });
    } catch (error) {
      console.warn(chalk.redBright("❌ Error during sign-in redirect:"), error);
      return handleMiddlewareError(error, "sign-in redirect");
    }
  }

  // Handle incomplete onboarding
  if (
    userId &&
    !orgId &&
    !sessionClaims?.metadata?.onboardingComplete &&
    !isPublicRoute(request)
  ) {
    console.log(
      chalk.yellowBright("⚠️ Redirecting to onboarding - incomplete profile")
    );
    const onboardingUrl = new URL("/onboarding", request.url);
    return NextResponse.redirect(onboardingUrl);
  }

  return null;
};

const handleSubdomainRewrite = (request: NextRequest, hostname: string) => {
  const url = request.nextUrl;
  const searchParams = request.nextUrl.searchParams.toString();
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // Handle root domain access
  if (
    hostname === "localhost:3000" ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    console.log(chalk.magenta("🏠 Accessing root domain"));
    return NextResponse.next();
  }

  // Handle subdomain rewrite
  try {
    console.log(chalk.cyan("🔄 Processing subdomain rewrite..."));
    const rewriteUrl = new URL(`/${hostname}${path}`, request.url);
    console.log(chalk.yellow("📝 Rewriting to:", rewriteUrl.toString()));
    return NextResponse.rewrite(rewriteUrl);
  } catch (error) {
    console.warn(chalk.redBright("❌ Error creating rewrite URL:"), error);
    return handleMiddlewareError(error, "URL rewrite");
  }
};

export default clerkMiddleware(
  /**
   * Middleware handler for authentication, localization, and routing
   *
   * This middleware performs the following operations in order:
   * 1. Handles internationalization and locale routing
   * 2. Protects non-public routes using Clerk authentication
   * 3. Manages user onboarding flow and redirects
   * 4. Handles subdomain routing and rewrites
   *
   * @param {ClerkMiddlewareAuth} auth - Clerk authentication helper for protecting routes and accessing session data
   * @param {NextRequest} request - Next.js request object containing URL, headers, and other request data
   * @param {NextFetchEvent} event - Next.js fetch event for handling response lifecycle
   * @returns {Promise<NextResponse>} Response object that may contain redirects, rewrites, or the original request
   * @throws {Error} When required configuration (host, environment variables) is missing
   */
  async (auth, request, event) => {
    try {
      console.log(chalk.magenta("🔒 Starting Clerk middleware..."));

      // Validate request object
      if (!request || !request.url) {
        console.warn(chalk.red("❌ Invalid request object"));
        throw new Error("Invalid request object received");
      }

      // Log request details
      console.log(chalk.yellow("📝 Request details:"), {
        url: request.url,
        method: request.method,
        headers: {
          host: request.headers.get("host"),
          origin: request.headers.get("origin"),
          referer: request.headers.get("referer"),
          "user-agent": request.headers.get("user-agent"),
          "accept-language": request.headers.get("accept-language"),
          " content-type": request.headers.get("content-type"),
        },
      });

      // Handle internationalization
      const intlResponse = await handleInternationalization(request);
      if (intlResponse) return intlResponse;

      // Validate request and environment
      const validationError = validateRequest(request);
      if (validationError) return validationError;

      // Process hostname
      const host = await (await request.headers).get("host")!;
      const hostname = host.replace(
        ".localhost:3000",
        `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
      );

      // Protect non-public routes
      if (!isPublicRoute(request)) {
        auth.protect();
      }

      // Extract authentication details
      const { userId, sessionClaims, orgId } = await auth();

      // Log authentication info
      console.log(chalk.yellow("👤 Auth Info:"), {
        userId: userId || "not authenticated",
        sessionClaims: sessionClaims || "no claims",
        orgId: orgId || "no org",
      });

      // Handle authentication flow
      const authResponse = await handleAuthentication(
        auth,
        request,
        userId,
        orgId,
        sessionClaims
      );
      if (authResponse) return authResponse;

      // Handle authorized access to protected routes
      if (userId && !isPublicRoute(request)) {
        console.log(
          chalk.greenBright("✅ Authorized access to protected route")
        );
        return NextResponse.next();
      }

      if (isPublicRoute(request)) {
        console.log(chalk.cyan("ℹ️ Accessing public route"));
        return NextResponse.next();
      }

      // Handle subdomain routing
      return handleSubdomainRewrite(request, hostname);
    } catch (error) {
      console.warn(
        chalk.redBright("❌ Unhandled error in Clerk Middleware:"),
        error
      );
      return handleMiddlewareError(error, "Clerk Middleware:");
    }
  }
);

const isPublicRoute = createRouteMatcher([
  "",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  // "/en/home/vehicles/KA03AL3782(.*)",
  // "/home(.*)",
  // "/home",
  "/test",
  "/:locale",
  "/:locale/api(.*)",
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
]);

// async (auth, request) => {
// ======================================================
// NOTE: Protect all routes
// if (!isPublicRoute(req)) {
// await auth.protect();
// }
// ======================================================
// NOTE: Protect routes based on user authentication status
// if (isProtectedRoute(req)) {
//   await auth.protect();
// }
// ======================================================
// NOTE: Protect routes based on user authorization status
// Restrict admin routes to users with specific permissions
// if (isProtectedRoute(req)) {
//   await auth.protect((has) => {
//     return (
//       has({ permission: "org:sys_memberships:manage" }) ||
//       has({ permission: "org:sys_domains_manage" })
//     );
//   });
// }
// ======================================================
// NOTE: Protect multiple groups of routes
// Restrict admin routes to users with specific permissions
// if (isTenantAdminRoute(req)) {
//   await auth.protect((has) => {
//     return (
//       has({ permission: "org:sys_memberships:manage" }) ||
//       has({ permission: "org:sys_domains_manage" })
//     );
//   });
// }
// // Restrict organization routes to signed in users
// if (isTenantRoute(req)) await auth.protect();
// }
// },

// ======================================================
// NOTE: Protect routes based on user authentication status
// const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/forum(.*)"]);
// ======================================================
// NOTE: Protect routes based on user authorization status
// const isProtectedRoute = createRouteMatcher(["/admin(.*)"]);
// ======================================================
// NOTE: Protect multiple groups of routes
// const isTenantRoute = createRouteMatcher([
//   "/organization-selector(.*)",
//   "/orgid/(.*)",
// ]);
// const isTenantAdminRoute = createRouteMatcher([
//   "/orgId/(.*)/memberships",
//   "/orgId/(.*)/domain",
// ]);

/**
 * Middleware configuration for path matching
 * Defines which routes should be processed by the middleware
 */
// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };

// NOTE: Old matcher
export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    // "/(en|es|pt)/:path*",
  ],
};

/**
 * Utility function to handle and log errors in middleware
 * @param error - The error object or unknown error value
 * @param context - The context where the error occurred (e.g., 'beforeAuth', 'afterAuth')
 * @returns NextResponse with a 500 status code and error message
 */
const handleMiddlewareError = (error: unknown, context: string) => {
  try {
    // Determine the error message based on error type
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : "Unknown error occurred";

    // Log the error with context and stack trace if available
    console.warn(chalk.red(`❌ Error in ${context}:`), chalk.red(errorMessage));

    if (error instanceof Error && error.stack) {
      console.warn(chalk.red("📋 Stack trace:"), error.stack);
    }

    // Log additional error details if available
    if (error instanceof Error && (error as any).code) {
      console.warn(chalk.red("🔍 Error code:"), (error as any).code);
    }

    // Create standardized error response
    const errorResponse = {
      error: "Internal Server Error",
      context: context,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    };

    // Return error response with appropriate headers
    return new NextResponse(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "X-Error-Context": context,
      },
    });
  } catch (handlingError) {
    // Fallback error handling in case the main error handling fails
    console.warn(
      chalk.red("❌ Critical error in error handler:"),
      chalk.red(
        handlingError instanceof Error ? handlingError.message : "Unknown error"
      )
    );

    // Return basic error response in case of critical failure
    return new NextResponse(
      JSON.stringify({ error: "Critical Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
