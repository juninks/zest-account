// Per-category monthly budgets (Premium). LocalStorage per user.
export interface Budget {
  category: string;
  limit: number;
}

const key = (uid: string) => `budgets_${uid}`;

export const getBudgets = (uid: string): Budget[] => {
  try {
    const raw = localStorage.getItem(key(uid));
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};

export const saveBudgets = (uid: string, list: Budget[]) => {
  localStorage.setItem(key(uid), JSON.stringify(list));
};

export const upsertBudget = (uid: string, b: Budget) => {
  const list = getBudgets(uid).filter((x) => x.category !== b.category);
  if (b.limit > 0) list.push(b);
  saveBudgets(uid, list);
};

export const removeBudget = (uid: string, category: string) => {
  saveBudgets(uid, getBudgets(uid).filter((b) => b.category !== category));
};
