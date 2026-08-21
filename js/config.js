// ============================================================
// Cloud configuration — from the Firebase project "kitty".
// Project settings > General > Your apps > SDK setup.
// The API key is PUBLIC by design (safe to commit); the
// Firestore security rules are what protect everyone's data.
// ============================================================
const CLOUD_CONFIG = {
  apiKey: 'AIzaSyD3AvlOm5QiEhu_anpJ0Lyzsln5NdRJ5xs',
  projectId: 'kitty-3494a',

  // Only this account can publish class materials. Everyone else sees
  // them but gets no add controls, and the Firestore rules reject their
  // writes even from the console. Fill in after your first sign-in:
  // the account menu shows your id until this is set.
  adminUid: '',
};
