// Lista de UIDs com acesso admin. Adicione aqui o seu UID do Firebase Authentication.
// Para descobrir: Firebase Console → Authentication → copie o UID da sua conta.
export const ADMIN_UIDS: string[] = [
  // "COLE_SEU_UID_AQUI",
];

// Liberação por e-mail (alternativa mais fácil que UID).
export const ADMIN_EMAILS: string[] = [
  "wildsonaguiar5@gmail.com",
];

export const isAdmin = (user: { uid?: string; email?: string | null } | null) => {
  if (!user) return false;
  if (user.uid && ADMIN_UIDS.includes(user.uid)) return true;
  if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) return true;
  return false;
};
