# Projects Scrips Documentation

## Development Scripts

### `npm run dev`

```
cp .env.local .env && npx ts-node src/seed/seed.ts && next dev --turbopack
```

- Copies local environment variables
- Runs database seeding script
- Starts development server with Turbopack

### `npm run build`

```
npx prisma generate && next build
```

- Generates Prisma client
- Builds the Next.js application
- Note: Used by Vercel for production deployment

### `npm run build:local`

```
npx ts-node src/seed/seed.ts && npx prisma generate && next build
```

- Runs database seeding script
- Generates Prisma client
- Builds the Next.js application locally

### **`npm run start`**

```
npx ts-node src/seed/seed.ts
```

* Starts the production server

### `npx run seed`

```
ts-node src/seed/seed.ts
```

- Runs the database seeding script independently using prisma

### `npm run lint`

```
next lint
```

Runs ESLint for code quality checks

### `npx prisma db seed` OR `npx prisma db seed`

```
ts-node src/seed/seed.ts
```

- Runs the database seeding script independently

## Environment Setup

- `.env.local`: Development environment variables
- `.env.prod`: Production environment variables
- Vercel: Environment variables should be configured in Vercel dashboard

## Important Notes

1. Seeding in production should be handled separately, not during startup
2. The build command is simplified for Vercel deployment
3. Database migrations should be handled through Vercel's Storage feature or manually
