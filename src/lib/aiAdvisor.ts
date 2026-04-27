// Simple rules-based "AI" financial advisor — instant, offline, no API keys needed.
// Analyzes user's transactions and returns a personalized tip.

export interface AdvisorTx {
  type: "income" | "expense";
  amount: number;
  category: string;
}

const TIPS_GENERIC = [
  "💡 Anote toda despesa, por menor que seja. O que não se mede, não se controla.",
  "💡 Tente poupar pelo menos 10% da sua renda todo mês — é a base da liberdade financeira.",
  "💡 Antes de comprar algo, espere 24h. Você verá que muitos desejos somem.",
  "💡 Crie uma reserva de emergência equivalente a 6 meses dos seus gastos.",
  "💡 Invista em conhecimento — é o ativo de maior retorno a longo prazo.",
];

export const getAdvice = (txs: AdvisorTx[]): string => {
  if (txs.length === 0) {
    return "👋 Comece adicionando suas receitas e despesas. Quanto mais dados, melhores as dicas que posso te dar!";
  }

  const income = txs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  // Category breakdown for expenses
  const byCat: Record<string, number> = {};
  txs.filter((t) => t.type === "expense").forEach((t) => {
    byCat[t.category] = (byCat[t.category] ?? 0) + t.amount;
  });
  const topCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];

  if (income === 0) {
    return "📥 Você ainda não registrou nenhuma receita. Adicione seu salário ou ganhos para acompanhar seu fluxo de caixa.";
  }

  if (balance < 0) {
    const pct = ((Math.abs(balance) / income) * 100).toFixed(0);
    return `⚠️ Atenção! Você gastou ${pct}% a mais do que ganhou. Revise sua categoria "${topCat?.[0] ?? "principal"}" — foi onde mais saiu dinheiro.`;
  }

  const savingsRate = (balance / income) * 100;

  if (savingsRate < 10) {
    return `📊 Sua taxa de poupança é de apenas ${savingsRate.toFixed(0)}%. O ideal é guardar pelo menos 20%. Tente reduzir gastos em "${topCat?.[0] ?? "lazer"}".`;
  }

  if (savingsRate >= 30) {
    return `🎯 Excelente! Você está poupando ${savingsRate.toFixed(0)}% da sua renda. Considere investir esse valor em renda fixa ou tesouro direto para o dinheiro render.`;
  }

  if (topCat && topCat[1] > income * 0.4) {
    return `🔍 A categoria "${topCat[0]}" representa mais de 40% dos seus gastos. Vale revisar se está em equilíbrio com seu orçamento.`;
  }

  // Random generic tip
  return TIPS_GENERIC[Math.floor(Math.random() * TIPS_GENERIC.length)];
};
