import { initializeApp, getApps, cert, applicationDefault, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  // If service account key is provided, use it (local dev)
  // Otherwise, use Application Default Credentials (Cloud Run)
  if (serviceAccountKey && serviceAccountKey !== "{}") {
    const serviceAccount = JSON.parse(serviceAccountKey) as ServiceAccount;
    return initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }

  return initializeApp({
    credential: applicationDefault(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const adminApp = getAdminApp();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp, 'spayduoc');
export const adminStorage = getStorage(adminApp);
export default adminApp;
