const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env" });

const env = process.env.NODE_ENV || "development";
const envFilePath = path.resolve(process.cwd(), `.env.${env}`);

if (fs.existsSync(envFilePath)) {
  console.log(`Loading environment variables from: ${envFilePath}`);
  require("dotenv").config({ path: envFilePath });
} else {
  console.error(`Environment file not found: ${envFilePath}`);
}
