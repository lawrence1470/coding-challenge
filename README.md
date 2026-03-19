# Coding Challenge — Todo App

A full-stack todo application built with TanStack Start, TanStack Query, PostgreSQL, and Better Auth.

## Stack

- **Framework**: TanStack Start (Vite + TanStack Router)
- **UI**: React 19 + TypeScript 5
- **Styling**: Tailwind CSS 4
- **Server State**: TanStack Query 5
- **Auth**: Better Auth (email/password)
- **Database**: PostgreSQL + Prisma 7

## Prerequisites

- Node.js 20+
- PostgreSQL running locally (or a hosted instance)

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://<user>@localhost:5432/<dbname>?schema=public"
BETTER_AUTH_SECRET="your-secret-here"
BETTER_AUTH_URL="http://localhost:3000"
```

Replace `<user>` and `<dbname>` with your PostgreSQL username and desired database name.

### 3. Set up the database

Run migrations to create the schema:

```bash
npx prisma migrate dev
```

If you update `prisma/schema.prisma`, regenerate the Prisma client:

```bash
npx prisma generate
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Run production build |
| `npm run lint` | Run ESLint |
| `npx prisma migrate dev` | Run database migrations |
| `npx prisma generate` | Regenerate Prisma client |
