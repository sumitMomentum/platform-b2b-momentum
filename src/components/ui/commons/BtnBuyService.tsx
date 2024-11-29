import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@mui/material";
import Link from "next/link";

async function BtnBuyService() {
  const user = await currentUser();

  return (
    <Link href={user ? "/home" : "/home"} passHref>
      <Button variant="contained" color="primary">
        Go to Home
      </Button>
    </Link>
  );
}

export default BtnBuyService;

// <div className="fixed top-10 right-10 z-50">
//       <div className="flex space-x-3">
//         <Link
//           href={user ? "/home" : "/home"}
//           className="rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-gray-100 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
//         >
//           Login
//         </Link>
//       </div>
//     </div>
{
  /* <Link
  href="https://github.com/The-SaaS-Factory/next-14-saas-boilerplate/"
  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
>
  View Github Repo 
</Link> */
}
