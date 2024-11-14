import { ReactNode, Suspense } from "react";
import {
  ClerkLoaded,
  ClerkLoading,
  SignIn,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import AdminLayout from "@/components/layouts/AdminLayout";
import { RedirectSuperAadminInLogin } from "@/utils/facades/frontendFacades/superAdminFrontendFacade";
import SuspenseClerk from "@/components/suspenseSkeleton/SuspenseClerk";
import { default as NextIntlClientProvider } from "next-intl";

const AdminRoot = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <ClerkLoading>
        <SuspenseClerk />
      </ClerkLoading>
      <ClerkLoaded>
        <SignedOut>
          <div className="flex justify-center py-5">
            <SignIn />
          </div>
        </SignedOut>
        <SignedIn>
          <div>
            <AdminLayout>{children}</AdminLayout>
          </div>
          <RedirectSuperAadminInLogin url="/admin" />
        </SignedIn>
      </ClerkLoaded>
    </main>
  );
};
export default AdminRoot;
