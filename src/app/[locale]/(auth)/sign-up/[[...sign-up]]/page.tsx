import { SignUp } from "@clerk/nextjs";
import { Box } from "@mui/material";
import path from "path";
import { env } from "process";

export default function Page() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh" // Full viewport height to center vertically
    >
      <SignUp path={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}/>
    </Box>
  );
}
