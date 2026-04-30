// Limits for the Free plan. Premium = unlimited.
export const FREE_MONTHLY_TX_LIMIT = 50;

export interface HasDate {
  createdAt?: { toDate?: () => Date };
}

export const countThisMonth = (txs: HasDate[]): number => {
  const now = new Date();
  return txs.filter((t) => {
    const d = t.createdAt?.toDate?.();
    return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
};

export const remainingFree = (txs: HasDate[]): number => {
  return Math.max(0, FREE_MONTHLY_TX_LIMIT - countThisMonth(txs));
};
