const chalk = require("chalk");
const { error } = require("console");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env" });

const env = process.env.NODE_ENV || "development";
const envFilePath = path.resolve(process.cwd(), `.env.${env}`);

if (fs.existsSync(envFilePath)) {
  const envColor =
    {
      local: chalk.blue,
      development: chalk.green,
      production: chalk.yellow,
      test: chalk.red,
    }[env] || chalk.white;

  console.log(envColor(`🌍 Environment: ${env}`)); // Log the environment with an icon
  console.log(
    chalk.cyan(
      `📄 Loading environment variables from: ${envFilePath
        .split(path.sep)
        .pop()}`
    )
  ); // Log the file name with a different color and icon

  require("dotenv").config({ path: envFilePath });
} else {
  console.error(chalk.red(`Environment file not found: ${envFilePath}`));
}
