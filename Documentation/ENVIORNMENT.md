# Environment Management in Our Project

In our project, we use different environment files to manage environment-specific settings. This allows us to have flexible configurations for local development, staging, production, and more. Each environment file contains specific configurations that are required to run the application in different environments. Below is an overview of the environment files and how the environment variables are managed.

## Environment Files

1. **`.env`**:

   - This is the default environment file. It contains the general environment variables for all environments. Typically, this file holds global variables that are shared across all environments, such as database connection strings, API keys, and general configurations.
   - Example:
     ```
     NODE_ENV=production
     POSTGRES_DATABASE_URL=postgres://<username>:<password>@<host>:<port>/<database>?sslmode=require
     ```
2. **`.env.local`**:

   - This is used for local development environments. It contains variables specific to your local machine and shouldn't be committed to version control. It will override any settings in `.env` when running locally.
   - Example:
     ```
     NEXT_PUBLIC_BASE_URL=http://localhost:3000
     ```
3. **`.env.development`**:

   - This is used for the development environment. It is typically used when running the app in a development environment, for instance, during testing or on staging servers.
   - Example:
     ```
     NODE_ENV=development
     NEXT_PUBLIC_BASE_URL=http://localhost:3000
     ```
4. **`.env.production`**:

   - This is for production environments, where you would have your production database URLs, API keys, and other sensitive configuration settings. This file should contain environment-specific settings for production and must be securely managed.
   - Example:
     ```
     NODE_ENV=production
     POSTGRES_DATABASE_URL=postgres://<username>:<password>@<host>:<port>/<database>?sslmode=require
     ```

## How Environment Variables Are Managed

### The Role of `NODE_ENV`

In the `.env` file, we define the `NODE_ENV` variable, which tells the application which environment it's running in. This is crucial for controlling various configurations such as debugging, logging, and database connections. Here's how the `NODE_ENV` variable is used:

### The `load-env.js` File

We have a utility file, `load-env.js`, which loads environment-specific variables depending on the value of `NODE_ENV`. This allows us to switch between different configurations seamlessly. Here's a breakdown of how it works:

1. `NODE_ENV` is set to `development`, `production`, or another environment value in `.env`.
2. The `load-env.js` script loads the environment variables dynamically based on the current value of `NODE_ENV`.
3. The script loads the appropriate `.env` file, for example:
   - If `NODE_ENV=development`, the script will load `.env.development`.
   - If `NODE_ENV=production`, the script will load `.env.production`.

### Declared Environment Variables

Here are the environment variables that are defined in the `.env` files and their purposes:

#### **Database URLs**

- **`POSTGRES_DATABASE_URL`**: The URL for the PostgreSQL database, which includes username, password, host, port, and database name. This connection string is used to connect the application to the database.
  - Example: `postgres://user:password@localhost:5432/mydatabase?sslmode=require`

#### **Application Config**

- **`NEXT_PUBLIC_DEMO_MODE`**: Boolean value to enable or disable demo mode in the application.
- **`NEXT_PUBLIC_ROOT_DOMAIN`**: The root domain for the application (e.g., `example.com`).
- **`NEXT_PUBLIC_BASE_URL`**: The base URL used in the app for API calls, e.g., `http://localhost:3000`.

#### **Clerk Config**

- **`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`**: The Clerk API publishable key for frontend authentication.
- **`CLERK_WEBHOOK_SECRET`**: Secret key for verifying Clerk webhooks.
- **`CLERK_SECRET_KEY`**: The Clerk secret key for server-side authentication.
- **`NEXT_PUBLIC_CLERK_SIGN_IN_URL`**: The URL where users can sign in (`/sign-in`).
- **`NEXT_PUBLIC_CLERK_SIGN_UP_URL`**: The URL where users can sign up (`/sign-up`).
- **`NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL`**: The URL where users are redirected after signing in.
- **`NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL`**: The URL where users are redirected after signing up.

#### **Enode Config**

- **`ENODE_OAUTH_URL`**: The OAuth URL for Enode’s authentication service.
- **`ENODE_CLIENT_ID`**: The Enode client ID used for OAuth.
- **`ENODE_CLIENT_SECRET`**: The Enode client secret used for OAuth.
- **`ENODE_API_URL`**: The Enode API URL to interact with Enode's services.
- **`ENODE_VEHICLE_ADD_REDIRECT`**: The URL to redirect to after adding a vehicle.
- **`ENODE_WEBHOOK_SECRET`**: Secret for verifying Enode webhook payloads.

#### **EmailJS Config**

- **`EMAILJS_SERVICE_ID`**: The service ID for EmailJS, used for sending emails.
- **`EMAILJS_TEMPLATE_ID`**: The template ID used to customize the email content.
- **`EMAILJS_PUBLIC_KEY`**: The public key for interacting with EmailJS’s API.

#### **Optional Variables**

- **`NOTIFICATION_LOOPS_ID`**: A unique identifier for notifications.

---

By managing environment variables in this structured way, we ensure that the application behaves differently depending on the environment (development, production, etc.) while keeping sensitive data like API keys secure. The `load-env.js` script plays a key role in making this process seamless and automated.
