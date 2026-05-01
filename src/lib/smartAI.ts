// Smart rules-based "AI" — analyzes monthly data and gives a personalized report.
// No external API needed; instant and reliable.

export interface SmartTx {
  type: "income" | "expense";
  amount: number;
  category: string;
  createdAt?: { toDate?: () => Date };
}

export interface MonthlyAnalysis {
  summary: string;
  insights: string[];
  warnings: string[];
  tips: string[];
  score: number; // 0-100 health score
}

const TIPS_GENERIC = [
  "Anote toda despesa, por menor que seja. O que não se mede, não se controla.",
  "Tente poupar pelo menos 20% da sua renda todo mês.",
  "Antes de comprar algo, espere 24h. Muitos desejos somem.",
  "Crie uma reserva de emergência equivalente a 6 meses dos seus gastos.",
  "Invista em conhecimento — é o ativo de maior retorno a longo prazo.",
  "Automatize sua poupança: transfira no dia do salário, não no fim do mês.",
  "Renegocie contas fixas (internet, celular, seguros) a cada 6 meses.",
];

export const analyzeMonth = (txs: SmartTx[]): MonthlyAnalysis => {
  const now = new Date();
  const m = txs.filter((t) => {
    const d = t.createdAt?.toDate?.();
    return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const income = m.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = m.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;
  const savingsRate = income > 0 ? (balance / income) * 100 : 0;

  const byCat: Record<string, number> = {};
  m.filter((t) => t.type === "expense").forEach((t) => {
    byCat[t.category] = (byCat[t.category] ?? 0) + t.amount;
  });
  const sorted = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const top = sorted[0];

  const insights: string[] = [];
  const warnings: string[] = [];
  const tips: string[] = [];

  if (m.length === 0) {
    return {
      summary: "Você ainda não tem transações neste mês. Adicione algumas pra eu poder te ajudar!",
      insights: [],
      warnings: [],
      tips: [TIPS_GENERIC[0]],
      score: 0,
    };
  }

  // Summary
  let summary = "";
  if (balance > 0) {
    summary = `Você teve um mês positivo: sobrou ${fmt(balance)} de ${fmt(income)} de receita.`;
  } else if (balance < 0) {
    summary = `Atenção! Você gastou ${fmt(Math.abs(balance))} a mais do que ganhou este mês.`;
  } else {
    summary = `Você fechou o mês no zero. Receita e despesa empatadas em ${fmt(income)}.`;
  }

  // Insights
  if (top) {
    const pct = ((top[1] / Math.max(expense, 1)) * 100).toFixed(0);
    insights.push(`💸 Sua maior categoria de gasto foi "${top[0]}" com ${fmt(top[1])} (${pct}% do total).`);
  }
  if (sorted.length > 1) {
    insights.push(`📊 Você gastou em ${sorted.length} categorias diferentes este mês.`);
  }
  if (income > 0) {
    insights.push(`📈 Sua taxa de poupança foi de ${savingsRate.toFixed(0)}%.`);
  }

  // Warnings
  if (balance < 0) {
    warnings.push(`🚨 Você está no negativo. Reveja gastos em "${top?.[0] ?? "categorias maiores"}".`);
  }
  if (savingsRate < 10 && income > 0) {
    warnings.push(`⚠️ Taxa de poupança abaixo de 10%. O ideal é guardar 20% ou mais.`);
  }
  if (top && top[1] > income * 0.4) {
    warnings.push(`⚠️ "${top[0]}" consumiu mais de 40% da sua renda. Avalie se está em equilíbrio.`);
  }

  // Tips
  if (savingsRate >= 30) {
    tips.push(`🎯 Excelente disciplina! Considere investir o excedente em renda fixa ou tesouro direto.`);
  } else if (savingsRate >= 15) {
    tips.push(`👏 Você está no caminho certo. Tente subir a poupança pra 20%.`);
  } else {
    tips.push(TIPS_GENERIC[Math.floor(Math.random() * TIPS_GENERIC.length)]);
  }
  if (top && byCat["Alimentação"] && byCat["Alimentação"] > income * 0.25) {
    tips.push(`🍽️ Alimentação representa mais de 25% da renda. Cozinhar em casa pode reduzir bastante.`);
  }
  if (income === 0) {
    tips.push(`📥 Você não registrou receitas este mês. Adicione seu salário pra ter visão completa.`);
  }

  // Health score (0-100)
  let score = 50;
  if (savingsRate >= 30) score = 95;
  else if (savingsRate >= 20) score = 85;
  else if (savingsRate >= 10) score = 70;
  else if (savingsRate >= 0) score = 55;
  else score = Math.max(10, 50 + savingsRate);

  return { summary, insights, warnings, tips, score: Math.round(score) };
};

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
