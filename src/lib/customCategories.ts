// Premium-only: user can add their own categories. Stored locally per user.
const key = (uid: string, type: "income" | "expense") =>
  `cats_${type}_${uid}`;

export const getCustomCategories = (
  uid: string,
  type: "income" | "expense"
): string[] => {
  try {
    const raw = localStorage.getItem(key(uid, type));
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
};

export const addCustomCategory = (
  uid: string,
  type: "income" | "expense",
  name: string
) => {
  const cleaned = name.trim().slice(0, 24);
  if (!cleaned) return;
  const list = getCustomCategories(uid, type);
  if (list.includes(cleaned)) return;
  list.push(cleaned);
  localStorage.setItem(key(uid, type), JSON.stringify(list));
};

export const removeCustomCategory = (
  uid: string,
  type: "income" | "expense",
  name: string
) => {
  const list = getCustomCategories(uid, type).filter((c) => c !== name);
  localStorage.setItem(key(uid, type), JSON.stringify(list));
};
