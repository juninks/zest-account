// Multi-goals storage (per user, localStorage). Premium feature.
export type GoalCategory =
  | "viagem"
  | "reserva"
  | "casa"
  | "carro"
  | "estudo"
  | "presente"
  | "saude"
  | "outro";

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  category: GoalCategory;
  createdAt: number;
}

export const GOAL_CATEGORIES: { value: GoalCategory; label: string; emoji: string }[] = [
  { value: "viagem", label: "Viagem", emoji: "✈️" },
  { value: "reserva", label: "Reserva", emoji: "🏦" },
  { value: "casa", label: "Casa", emoji: "🏠" },
  { value: "carro", label: "Carro", emoji: "🚗" },
  { value: "estudo", label: "Estudo", emoji: "📚" },
  { value: "presente", label: "Presente", emoji: "🎁" },
  { value: "saude", label: "Saúde", emoji: "💊" },
  { value: "outro", label: "Outro", emoji: "💰" },
];

const key = (uid: string) => `goals_${uid}`;

export const getGoals = (uid: string): Goal[] => {
  try {
    const raw = localStorage.getItem(key(uid));
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};

export const saveGoals = (uid: string, goals: Goal[]) => {
  localStorage.setItem(key(uid), JSON.stringify(goals));
};

export const addGoal = (uid: string, g: Omit<Goal, "id" | "saved" | "createdAt">): Goal => {
  const list = getGoals(uid);
  const goal: Goal = {
    ...g,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    saved: 0,
    createdAt: Date.now(),
  };
  saveGoals(uid, [goal, ...list]);
  return goal;
};

export const updateGoal = (uid: string, id: string, patch: Partial<Goal>) => {
  const list = getGoals(uid).map((g) => (g.id === id ? { ...g, ...patch } : g));
  saveGoals(uid, list);
};

export const deleteGoal = (uid: string, id: string) => {
  saveGoals(uid, getGoals(uid).filter((g) => g.id !== id));
};

export const addToGoal = (uid: string, id: string, amount: number) => {
  const list = getGoals(uid).map((g) =>
    g.id === id ? { ...g, saved: Math.max(0, g.saved + amount) } : g
  );
  saveGoals(uid, list);
};

export const getCategoryMeta = (c: GoalCategory) =>
  GOAL_CATEGORIES.find((x) => x.value === c) ?? GOAL_CATEGORIES[GOAL_CATEGORIES.length - 1];
