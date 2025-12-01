# Database Setup for Vercel

## Quick Start (3 steps)

### 1. Create Vercel Postgres Database
1. Go to your Vercel project dashboard
2. Click **Storage** → **Create Database** → **Postgres**
3. Name it `studio-db` and click **Create**
4. Click **Connect Project** and select your project

### 2. Run Migrations Locally
```bash
# Pull environment variables from Vercel
npx vercel env pull .env.local

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

### 3. Deploy
```bash
git add .
git commit -m "Add backend infrastructure"
git push
```

Vercel will automatically:
- Generate Prisma Client (`postinstall` script)
- Run migrations on deployment

## Verify Setup

```bash
# Test locally
npm run dev

# Test API
curl http://localhost:3000/api/popups
```

## Database Models

- ✅ User
- ✅ Category
- ✅ Nominee
- ✅ Vote
- ✅ Submission
- ✅ Popup
- ✅ TimelineEvent
- ✅ CulturalInsight

## Useful Commands

```bash
# View database in browser
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database (deletes all data!)
npx prisma migrate reset
```

That's it! Your backend is ready. 🎉
