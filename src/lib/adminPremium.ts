import { collection, doc, getDocs, setDoc, deleteField, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface AdminUserRow {
  uid: string;
  email: string | null;
  whatsapp?: string | null;
  premium: boolean;
  source: "users" | "premium_requests" | "both" | "unknown";
  status?: string | null;
  createdAt?: any;
}

/**
 * Lê todos os documentos de `users` e `premium_requests` e mescla por UID.
 * Premium é true se qualquer um dos dois docs tiver premium === true.
 */
export const listAllUsers = async (): Promise<AdminUserRow[]> => {
  const map = new Map<string, AdminUserRow>();

  // users
  try {
    const usersSnap = await getDocs(collection(db, "users"));
    usersSnap.forEach((d) => {
      const data = d.data() as any;
      map.set(d.id, {
        uid: d.id,
        email: data.email ?? null,
        whatsapp: data.whatsapp ?? null,
        premium: data.premium === true,
        source: "users",
        status: data.status ?? null,
        createdAt: data.createdAt ?? null,
      });
    });
  } catch (e) {
    console.error("Erro listando users:", e);
  }

  // premium_requests
  try {
    const reqSnap = await getDocs(collection(db, "premium_requests"));
    reqSnap.forEach((d) => {
      const data = d.data() as any;
      const existing = map.get(d.id);
      if (existing) {
        map.set(d.id, {
          ...existing,
          email: existing.email ?? data.email ?? null,
          whatsapp: existing.whatsapp ?? data.whatsapp ?? null,
          premium: existing.premium || data.premium === true,
          source: "both",
          status: data.status ?? existing.status ?? null,
          createdAt: existing.createdAt ?? data.createdAt ?? null,
        });
      } else {
        map.set(d.id, {
          uid: d.id,
          email: data.email ?? null,
          whatsapp: data.whatsapp ?? null,
          premium: data.premium === true,
          source: "premium_requests",
          status: data.status ?? null,
          createdAt: data.createdAt ?? null,
        });
      }
    });
  } catch (e) {
    console.error("Erro listando premium_requests:", e);
  }

  return Array.from(map.values()).sort((a, b) => {
    // premium primeiro, depois por email
    if (a.premium !== b.premium) return a.premium ? -1 : 1;
    return (a.email ?? "").localeCompare(b.email ?? "");
  });
};

/**
 * Ativa Premium para um UID — escreve em `users/{uid}` (merge).
 * Esta é a fonte oficial. Também atualiza `premium_requests/{uid}` se existir.
 */
export const setPremium = async (uid: string, value: boolean, email?: string | null) => {
  await setDoc(
    doc(db, "users", uid),
    {
      uid,
      email: email ?? null,
      premium: value,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  // Também marca o request como aprovado/revogado, se houver
  try {
    await setDoc(
      doc(db, "premium_requests", uid),
      {
        premium: value,
        status: value ? "approved" : "revoked",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch {
    // documento pode não existir ou regras podem bloquear — ignorar
  }
};
