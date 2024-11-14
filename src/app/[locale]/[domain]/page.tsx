import { notFound } from "next/navigation";
import { getPostsForSite, getSiteData } from "@/lib/fetchers";
//import prisma from "@/lib/db";

export async function generateStaticParams() {
  // const allSites = await prisma.site.findMany({
  //   select: {
  //     subdomain: true,
  //     customDomain: true,
  //   },
  //   // feel free to remove this filter if you want to generate paths for all sites
  //   where: {
  //     subdomain: "demo",
  //   },
  // });

  const allPaths: any = [];
  allPaths
    .flatMap(
      ({
        subdomain,
        customDomain,
      }: {
        subdomain: string;
        customDomain: string;
      }) => [
        subdomain && {
          domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
        },
        customDomain && {
          domain: customDomain,
        },
      ]
    )
    .filter(Boolean);

  return allPaths;
}

export default async function SiteHomePage(
  props: {
    params: Promise<{ domain: string }>;
  }
) {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);
  const [data, posts] = await Promise.all([
    getSiteData(domain),
    getPostsForSite(domain),
  ]);

  if (!data) {
    notFound();
  }

  console.log(posts);


  return (
    <>
      <div className="mb-20 w-full">
        {/* {posts.length > 0 ? (
          <div className="mx-auto w-full max-w-screen-xl md:mb-28 lg:w-5/6">
            <Link href={`/${posts[0].slug}`}>
              <div className="group relative mx-auto h-80 w-full overflow-hidden sm:h-150 lg:rounded-xl"></div>
              <div className="mx-auto mt-10 w-5/6 lg:w-full">
                <h2 className="my-10 font-title text-4xl dark:text-white md:text-6xl">
                  {posts[0].title}
                </h2>
                <p className="w-full text-base dark:text-white md:text-lg lg:w-2/3">
                  {posts[0].description}
                </p>
                <div className="flex w-full items-center justify-start space-x-4">
                  <div className="relative h-8 w-8 flex-none overflow-hidden rounded-full"></div>
                  <p className="ml-3 inline-block whitespace-nowrap align-middle text-sm font-semibold dark:text-white md:text-base">
                    {data.user?.name}
                  </p>
                  <div className="h-6 border-l border-stone-600 dark:border-stone-400" />
                  <p className="m-auto my-5 w-10/12 text-sm font-light text-stone-500 dark:text-stone-400 md:text-base"></p>
                </div>
              </div>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Image
              alt="missing post"
              src="https://illustrations.popsy.co/gray/success.svg"
              width={400}
              height={400}
              className="dark:hidden"
            />
            <Image
              alt="missing post"
              src="https://illustrations.popsy.co/white/success.svg"
              width={400}
              height={400}
              className="hidden dark:block"
            />
            <p className="font-title text-2xl text-stone-600 dark:text-stone-400">
              No posts yet.
            </p>
          </div>
        )}
      </div>

      {posts.length > 1 && (
        <div className="mx-5 mb-20 max-w-screen-xl lg:mx-24 2xl:mx-auto">
          <h2 className="mb-10 font-title text-4xl dark:text-white md:text-5xl">
            More stories
          </h2>
          <div className="grid w-full grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
            posts
          </div>
        </div>
      )} */}
      </div>
    </>
  );
}
