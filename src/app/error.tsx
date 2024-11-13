"use client";

import ErrorPage from "@/components/layouts/errors/ErrorPage";
import chalk, { red, yellow } from "chalk";
import { log } from "console";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
     if (error) {
      // Log detailed error information with colors and emojis
      console.log(chalk.red("🚨 Error message:"), chalk.yellow(error.message));
      console.log(chalk.red("🆔 Error name:"), chalk.yellow(error.name));
      console.log(chalk.red("🗂️ Error stack:"), chalk.yellow(error.stack));
      console.log(chalk.red("🔍 Error cause:"), chalk.yellow(error.cause));
      console.log(chalk.red("🧩 Error digest:"), chalk.yellow(error.digest));

      // Additional logging for ErrorOptions
      if (error instanceof Error) {
        console.log(chalk.red("⚙️ Error options:"), {
          cause: chalk.yellow(error.cause), // Log the cause from ErrorOptions
        });
      }
    }
  }, [error]);
  return (
    <html>
      <body>
        <ErrorPage reset={reset} message={error.message} />
      </body>
    </html>
  );
}
