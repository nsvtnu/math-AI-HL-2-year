# Backend setup — one-time, about 5 minutes

The code is already wired. You just create the (free) database and paste two values.

## 1. Create the Supabase project

1. Go to https://supabase.com and click **Start your project** — sign in with your **GitHub** account.
2. Click **New project**.
   - Name: `mathkitty`
   - Database password: click **Generate** and SAVE it somewhere (you rarely need it, but losing it is annoying).
   - Region: pick the one closest to your school.
3. Wait ~1 minute while it provisions.

## 2. Create the tables

1. In the left sidebar open **SQL Editor** → **New query**.
2. Open the file `supabase-schema.sql` from this repo, copy ALL of it, paste it in, press **Run**.
3. It should say "Success. No rows returned".

## 3. Switch off email confirmation

Accounts use usernames, not real emails, so confirmation mails must be off:

1. Left sidebar → **Authentication** → **Sign In / Providers** (or **Providers**).
2. Open **Email** and turn **Confirm email** OFF. Save.

## 4. Connect the app

1. Left sidebar → **Project Settings** → **API** (or **Data API**).
2. Copy two values:
   - **Project URL** (like `https://abcdefghijkl.supabase.co`)
   - **anon / public** key (the long one marked public)
3. Open `js/config.js` in this repo and replace the two placeholders with them. The anon key is public by design — committing it is fine; row-level security in the database is what protects the data.

## 5. Ship it

Commit and push in GitHub Desktop. After Vercel redeploys, a **Sign in / Create account** button appears at the bottom of the sidebar, plus a **Leaderboard** page in the nav.

## What your classmates do

Nothing technical: open the site → **Sign in / Create account** → pick a username + password. Their progress then follows them across devices, they appear on the leaderboard, and after answering a question they see what percentage of the class got it right.

## Notes

- The app still works fully offline and logged out — the cloud is a bonus layer, not a requirement.
- Free tier limits are far beyond what a class will ever hit.
- If someone forgets their password there is no reset flow (no real emails). They can make a new account, or you can delete the old one in Supabase → Authentication → Users.
