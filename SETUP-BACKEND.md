# Backend setup — one-time, about 5 minutes

Uses **Firebase**, so you sign in with the Google account you already have. The code is already wired; you create the project and paste two values.

## 1. Create the project

1. Go to https://console.firebase.google.com and sign in with your Google account.
2. Click **Create a project** (or **Add project**).
   - Name it `mathkitty`.
   - On the Google Analytics step, switch it **off** — you do not need it.
3. Wait about 30 seconds, then click **Continue**.

## 2. Turn on username sign-in

1. Left sidebar → **Build** → **Authentication** → **Get started**.
2. Choose **Email/Password** from the provider list.
3. Toggle the first switch (**Email/Password**) to **Enabled**. Leave "Email link" off. **Save**.

Accounts use usernames that are turned into internal addresses, so no real email is ever sent and nobody has to confirm anything.

## 3. Create the database

1. Left sidebar → **Build** → **Firestore Database** → **Create database**.
2. Pick the location closest to your school (this cannot be changed later).
3. Choose **Start in production mode** — locked down by default, which is what you want. Click **Create**.

## 4. Publish the security rules

The database currently blocks everything, so this step is required or the app cannot read or write anything.

1. In Firestore Database, open the **Rules** tab.
2. Delete what is there, paste the entire contents of `firestore-rules.txt` from this repo, and press **Publish**.

## 5. Connect the app

1. Click the **gear icon** (top left) → **Project settings**.
2. Scroll to **Your apps** and click the **web icon** `</>`.
3. Nickname it `mathkitty`, leave Firebase Hosting unchecked, click **Register app**.
4. You are shown a `firebaseConfig` block. You only need two lines from it:
   - `apiKey`
   - `projectId`
5. Open `js/config.js` in this repo and paste both in, replacing the placeholders.

The API key is public by design — it identifies the project, it does not grant access. The rules from step 4 are what actually protect the data.

## 6. Ship it

Commit and push in GitHub Desktop. Once Vercel redeploys, a **Sign in / Create account** button appears at the bottom of the sidebar and a **Leaderboard** page appears in the nav.

## 7. Make yourself the class owner

This is what lets you — and only you — publish handout links on unit pages. Everyone else sees them but gets no add controls, and the database rejects their writes even from the browser console.

1. On the live site, sign in and create your account.
2. Click your name in the top right. While no owner is set, the menu shows **your account id**.
3. Copy it into two places:
   - `js/config.js` → `adminUid: 'that-id'`
   - `firestore-rules.txt` → replace `PASTE_YOUR_UID` with the same id
4. In Firebase Console → **Firestore Database → Rules**, paste the updated rules and press **Publish**.
5. Push the `js/config.js` change.

The account id disappears from the menu once step 3 is done. Until then, materials cannot be published at all — the rules deny it — which is why this step is not optional if you want handouts on the site.

## What your classmates do

Open the site → **Sign in / Create account** → pick a username and password. That is all. Their progress then follows them between phone and laptop, they appear on the leaderboard, and after answering a question they see what percentage of the class got it right.

## Notes

- The app still works fully offline and signed out — the cloud is a bonus layer, not a requirement.
- The free Spark plan is far more than a class will ever use, and it cannot run up a bill.
- Nobody can read anyone else's progress; the leaderboard row (username, XP, solved, streak) is the only shared data.
- There is no password reset, since there are no real emails. If someone forgets theirs, delete the account in **Authentication → Users** and let them sign up again.
