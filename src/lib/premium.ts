import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface UserDoc {
  premium: boolean;
  email?: string | null;
}

export const subscribeUser = (uid: string, cb: (u: UserDoc) => void) => {
  let userDoc: UserDoc = { premium: false };
  let requestDoc: Partial<UserDoc> = {};

  const emit = () => {
    cb({ ...userDoc, premium: userDoc.premium === true || requestDoc.premium === true });
  };

  const unsubUser = onSnapshot(
    doc(db, "users", uid),
    (snap) => {
      userDoc = (snap.data() as UserDoc) ?? { premium: false };
      emit();
    },
    (err) => console.error("Erro ao ler usuário premium:", err)
  );

  const unsubRequest = onSnapshot(
    doc(db, "premium_requests", uid),
    (snap) => {
      requestDoc = (snap.data() as Partial<UserDoc>) ?? {};
      emit();
    },
    (err) => console.error("Erro ao ler pedido premium:", err)
  );

  return () => {
    unsubUser();
    unsubRequest();
  };
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
