# Fresh Check - Database Setup Guide

## Issue: Prisma Client Generation Failed

The error you're seeing is due to:

1. **OneDrive file locking** - Prisma can't write to `node_modules/.prisma/client/`
2. **Database not connected** - MySQL server is not running or not accessible

## Solution Options

### Option 1: Move Project Out of OneDrive (Recommended)

OneDrive locks files which prevents Prisma from generating the client.

```bash
# Move the project to a local folder
# Example: C:\Projects\FreshCheck
```

Then run:

```bash
cd backend
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

### Option 2: Use SQLite Instead of MySQL

If you don't have MySQL installed, use SQLite (simpler, no server needed):

1. **Update `backend/prisma/schema.prisma`:**

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

2. **Update `backend/.env`:**

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="freshcheck_secret_key_123"
PORT=3001
```

3. **Run setup:**

```bash
cd backend
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

### Option 3: Install and Start MySQL

1. **Install MySQL:**

   - Download from: https://dev.mysql.com/downloads/installer/
   - Or use XAMPP: https://www.apachefriends.org/

2. **Start MySQL Server**

3. **Create Database:**

```sql
CREATE DATABASE freshcheck;
```

4. **Update credentials in `backend/.env`** if needed

5. **Run setup:**

```bash
cd backend
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

## Quick Test

After setup, test the login:

**Frontend:** http://localhost:3000/login
**Credentials:**

- Email: `admin@freshcheck.com`
- Password: `admin123`

## Current Status

✅ Frontend: Running on port 3000
❌ Backend: Running but can't connect to database
❌ Database: Not connected

Choose one of the options above to complete the setup!
