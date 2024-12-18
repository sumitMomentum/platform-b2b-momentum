"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { Breadcrumbs, Chip, styled } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useRouter } from "next/navigation";

type Btn = {
  name: string;
  href?: string;
  icon?: React.ElementType | null;
  fn?: () => void;
};

type BreadcrumbItem = {
  name: string;
  href: string;
};

type PageNameProps = {
  name?: string;
  btn1?: Btn;
  btn2?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  isSubPage?: boolean;
};

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor = theme.palette.primary;
  // const backgroundColor =
  //   theme.palette.mode === "light"
  //     ? theme.palette.grey[100]
  //     : theme.palette.grey[800];
  return {
    // backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover": {
      boxShadow: theme.shadows[2],
      shadowColor: theme.palette.primary[400],
      color: theme.palette.primary[400],
    },
  };
}) as typeof Chip;

const PageName = ({
  name,
  btn1,
  btn2,
  breadcrumbs,
  isSubPage,
}: PageNameProps) => {
  const router = useRouter();
  const handleClick = (href: string) => {
    router.push(href);
  };

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {breadcrumbs.map((nav) => (
        <StyledBreadcrumb
          component="a"
          href={nav.href}
          onClick={() => handleClick(nav.href)}
          label={nav.name}
          variant="outlined"
        />
      ))}
      <Chip color="primary" label={name} />
    </Breadcrumbs>
  );
};

export default PageName;

// return (
//   <>
//     <div className="-mt-3">
//       <div className="flex justify-between">
//         <div className="flex flex-col my-2 space-y-1">
//           <nav className="-ml-3  sm:flex" aria-label="Breadcrumb">
//             <ol role="list" className="flex items-center space-x-3">
//               {breadcrumbs?.map((item, index) => (
//                 <li key={index}>
//                   <div className="flex items-center">
//                     {index > 0 && (
//                       <ChevronRightIcon
//                         className="h-5 w-5 flex-shrink-0 text-primary"
//                         aria-hidden="true"
//                       />
//                     )}
//                     <Link
//                       href={item.href}
//                       className="ml-4 lg:hidden text-sm truncate text-primary"
//                     >
//                       {item.name.length > 14
//                         ? item.name.substring(0, 14) + "..."
//                         : item.name}
//                     </Link>
//                     <Link
//                       href={item.href}
//                       className="ml-4 hidden lg:flex text-sm truncate text-primary"
//                     >
//                       {item.name}
//                     </Link>
//                   </div>
//                 </li>
//               ))}
//             </ol>
//           </nav>
//           <div className="flex">
//             <h1
//               className={`${
//                 isSubPage ? "text-subtitle py-4" : "text-title"
//               }  font-semibold `}
//             >
//               {name}
//             </h1>
//           </div>
//         </div>
//         <div className="flex space-x-3 items-center">
//           {btn1 &&
//             (btn1.fn ? (
//               <ButtonFunction
//                 btn={{
//                   name: btn1.name,
//                   icon: btn1.icon,
//                   fn: btn1.fn,
//                 }}
//               />
//             ) : (
//               <Link href={btn1.href as string} className="btn-icon ">
//                 {" "}
//                 {btn1.icon &&
//                   React.createElement(btn1.icon, {
//                     className: "h-5 w-5 text-primary",
//                     "aria-hidden": "true",
//                   })}
//                 <span>{btn1.name}</span>
//               </Link>
//             ))}

//           {btn2 && btn2}
//         </div>
//       </div>
//       <hr className="mb-1" />
//     </div>
//   </>
// );
