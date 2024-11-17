# Scripts Documentation

This document provides an overview of the available NPM scripts in the project and how to use them.

## Project Scripts

### 1. **`clean`**

```bash
rimraf .next node_modules package-lock.json yarn.lock pnpm-lock.yaml && npm cache clean --force && npx prisma generate
```

- **Purpose**: Cleans up the project by removing temporary files, dependencies, and the Prisma client, ensuring a fresh environment.
  - Deletes `.next` (build folder), `node_modules`, `package-lock.json`, `yarn.lock`, and `pnpm-lock.yaml`.
  - Clears the npm cache.
  - Regenerates the Prisma client by running `npx prisma generate`.

### 2. **`dev`**

```bash
node load-env.js && npx next dev --turbo
```

- **Purpose**: Starts the Next.js development server with environment variables loaded from the `load-env.js` script.
  - This ensures the environment variables are dynamically loaded before the application starts.

### 3. **`build`**

```bash
npx prisma generate && next build
```

- **Purpose**: Builds the Next.js application and generates the Prisma client.
  - First, it regenerates the Prisma client using `npx prisma generate`.
  - Then, it builds the Next.js application with `next build`.

### 4. **`start`**

```bash
next start
```

- **Purpose**: Starts the Next.js application in production mode.
  - Assumes that the application has been built using the `next build` command.

### 5. **`build:local`**

```bash
node load-env.js && npx prisma generate && next build
```

- **Purpose**: Builds the application in a local environment, loading environment variables using `load-env.js`.
  - Generates the Prisma client with `npx prisma generate`.
  - Builds the Next.js application using `next build`.

### 6. **`start:local`**

```bash
node load-env.js && next start
```

- **Purpose**: Starts the Next.js application in a local environment, loading environment variables using `load-env.js`.

### 7. **`seed`**

```bash
node load-env.js && npx prisma db seed
```

- **Purpose**: Seeds the database using Prisma.
  - Ensures that environment variables are loaded using `load-env.js` before seeding the database.

### 8. **`lint`**

```bash
next lint
```

- **Purpose**: Runs ESLint to lint the Next.js application.
  - Helps in maintaining code quality and ensuring consistent coding standards.

### 9. **`generate:prisma`**

```bash
npx prisma generate
```

- **Purpose**: Regenerates the Prisma client based on the latest Prisma schema.
  - This is useful when making changes to the Prisma schema.

### 10. **`migrate:dev`**

```bash
dotenv -e .env.local -- npx prisma migrate dev
```

- **Purpose**: Runs database migrations in development mode.
  - Loads environment variables from the `.env.local` file.
  - Applies migrations to the development database using `prisma migrate dev`.

### 11. **`migrate:prod`**

```bash
dotenv -e .env.production -- npx prisma migrate deploy
```

- **Purpose**: Runs database migrations in production mode.
  - Loads environment variables from the `.env.production` file.
  - Deploys migrations to the production database using `prisma migrate deploy`.

---

## Prisma Scripts

Prisma has built-in commands that can be executed using `npx prisma`. Below are the common Prisma commands and their usage.

### 1. **`npx prisma generate`**

- **Purpose**: Regenerates the Prisma client based on the schema defined in `schema.prisma`.
- **Usage**: This command is typically run after any changes to the Prisma schema to update the client.

### 2. **`npx prisma migrate dev`**

- **Purpose**: Applies migrations to the development database.
- **Usage**: This command will:
  - Generate migration files for changes made to the Prisma schema.
  - Apply the migration to the local database.
  - This is used during development to ensure your database is in sync with your schema.

### 3. **`npx prisma migrate deploy`**

- **Purpose**: Deploys the migrations to a production or staging database.
- **Usage**: This command is used to apply migrations in production environments, typically after generating migration files in development.

### 4. **`npx prisma migrate dev --name <migration-name>`**

- **Purpose**: Applies migrations to the development database with a specified migration name.
- **Usage**: This is used when you want to name the migration for easier identification.
  - Example: `npx prisma migrate dev --name add_user_table`
  - It generates and applies the migration with the provided name, like `add_user_table`, making it easier to track changes in version control.

### 5. **`npx prisma db seed`**

- **Purpose**: Seeds the database with initial data.
- **Usage**: This command runs a custom seed script (like `ts-node src/seed/seed.ts`).
  - It populates the database with initial or test data, making the application ready for use.

### 6. **`npx prisma studio`**

- **Purpose**: Opens Prisma Studio, a visual editor for your database.
- **Usage**: Use this to inspect and edit data in your database.

### 7. **`npx prisma introspect`**

- **Purpose**: Generates a Prisma schema from an existing database.
- **Usage**: If you have an existing database, this command will introspect the database and generate a `schema.prisma` file to reflect its structure.
