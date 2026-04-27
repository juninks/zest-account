import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface UserDoc {
  premium: boolean;
  email?: string | null;
}

export const subscribeUser = (uid: string, cb: (u: UserDoc) => void) => {
  return onSnapshot(doc(db, "users", uid), (snap) => {
    cb((snap.data() as UserDoc) ?? { premium: false });
  });
};

export const requestPremium = async (uid: string, email: string | null, whatsapp: string) => {
  await setDoc(doc(db, "premium_requests", uid), {
    uid,
    email: email ?? null,
    whatsapp,
    status: "pending",
    createdAt: serverTimestamp(),
  });
};
