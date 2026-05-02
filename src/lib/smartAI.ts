// Smart rules-based "AI" — analyzes monthly data and gives a personalized report.
// Always returns DIFFERENT phrasing on each refresh (random selection from large pools).

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
  score: number;
}

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Pools of phrasings — each call picks a different one
const POSITIVE_OPENERS = [
  (b: number, i: number) => `Mês fechado no positivo: você guardou ${fmt(b)} de ${fmt(i)} de receita. Bom trabalho!`,
  (b: number, i: number) => `Sobrou ${fmt(b)} este mês. Continue nesse ritmo e seu patrimônio cresce rápido.`,
  (b: number, i: number) => `Resultado positivo de ${fmt(b)}. Você está fazendo o dinheiro trabalhar a seu favor.`,
  (b: number, i: number) => `Mais um mês no azul — ${fmt(b)} sobrando de ${fmt(i)} ganhos. Disciplina paga.`,
  (b: number, i: number) => `Saldo final: ${fmt(b)} positivos. Que tal investir esse excedente?`,
];

const NEGATIVE_OPENERS = [
  (a: number) => `Cuidado: você gastou ${fmt(a)} a mais do que ganhou. Hora de revisar prioridades.`,
  (a: number) => `Mês no vermelho — ${fmt(a)} negativos. Vamos entender onde podar.`,
  (a: number) => `Atenção, déficit de ${fmt(a)} este mês. Identifiquei pontos pra você atacar.`,
  (a: number) => `Suas despesas superaram a receita em ${fmt(a)}. Não entre em pânico, dá pra reverter.`,
];

const NEUTRAL_OPENERS = [
  (i: number) => `Você empatou: ${fmt(i)} entrando, ${fmt(i)} saindo. Pequenas economias já fariam diferença.`,
  (i: number) => `Mês equilibrado em ${fmt(i)}. Próximo desafio: gerar sobra real.`,
];

const TIPS_LOW_SAVINGS = [
  "Tente guardar 10% antes mesmo de gastar — pague-se primeiro.",
  "Liste seus 3 maiores gastos do mês. Algum deles pode ser cortado pela metade?",
  "Renegocie contas fixas (internet, streaming, celular). Costuma render 50–100 reais/mês.",
  "Use a regra dos 30 dias: anote o que quer comprar e espere. Se ainda quiser, compra.",
  "Cancele assinaturas que você não usou no último mês. Provavelmente tem 1 ou 2.",
  "Cozinhar em casa 3x mais por semana já economiza centenas de reais.",
];

const TIPS_HEALTHY = [
  "Você tem disciplina. Considere abrir um Tesouro Selic ou CDB pra render mais.",
  "Com sua taxa de poupança, em 12 meses você teria uma reserva sólida. Calcule a meta!",
  "Que tal dividir o excedente: 50% reserva, 30% investimento, 20% sonho pessoal?",
  "Aumente automaticamente sua poupança em 1% a cada mês. Você nem sente.",
  "Estude um pouco sobre renda fixa — pode aumentar seu rendimento sem risco grande.",
];

const TIPS_GENERIC = [
  "Anote toda despesa, por menor que seja. O que não se mede, não se controla.",
  "Crie uma reserva de emergência de 6 meses dos seus gastos.",
  "Antes de financiar algo, pergunte: você compraria à vista? Se não, talvez não precise.",
  "Invista em conhecimento — é o ativo que rende mais a longo prazo.",
  "Automatize sua poupança: transfira no dia do salário, não no fim do mês.",
  "Revise seu orçamento toda sexta-feira. 5 minutos por semana mudam tudo.",
  "Compare preços antes de qualquer compra acima de 100 reais.",
  "Use cashback e programas de fidelidade dos cartões que já tem.",
];

const NO_DATA = [
  "Você ainda não registrou transações neste mês. Adicione algumas para eu te ajudar!",
  "Sem dados deste mês ainda. Comece registrando seu salário e despesas básicas.",
  "Pra eu fazer uma análise útil, registre pelo menos 3 transações do mês atual.",
];

export const analyzeMonth = (txs: SmartTx[]): MonthlyAnalysis => {
  const now = new Date();
  const m = txs.filter((t) => {
    const d = t.createdAt?.toDate?.();
    return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  if (m.length === 0) {
    return {
      summary: pick(NO_DATA),
      insights: [],
      warnings: [],
      tips: [pick(TIPS_GENERIC)],
      score: 0,
    };
  }

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

  let summary: string;
  if (balance > 0) summary = pick(POSITIVE_OPENERS)(balance, income);
  else if (balance < 0) summary = pick(NEGATIVE_OPENERS)(Math.abs(balance));
  else summary = pick(NEUTRAL_OPENERS)(income);

  const insights: string[] = [];
  const warnings: string[] = [];
  const tips: string[] = [];

  if (top) {
    const pct = ((top[1] / Math.max(expense, 1)) * 100).toFixed(0);
    const variants = [
      `💸 Maior gasto: "${top[0]}" levou ${fmt(top[1])} (${pct}% do total).`,
      `🔍 "${top[0]}" foi sua categoria campeã de gastos: ${fmt(top[1])} (${pct}%).`,
      `📌 Concentração em "${top[0]}": ${fmt(top[1])}, ${pct}% das suas despesas.`,
    ];
    insights.push(pick(variants));
  }
  if (sorted.length > 1) {
    const variants = [
      `📊 Você diversificou em ${sorted.length} categorias diferentes este mês.`,
      `🗂️ Suas despesas se espalharam por ${sorted.length} categorias.`,
      `📈 ${sorted.length} categorias ativas — visão ampla dos seus hábitos.`,
    ];
    insights.push(pick(variants));
  }
  if (income > 0) {
    insights.push(`📥 Taxa de poupança do mês: ${savingsRate.toFixed(0)}%.`);
  }
  insights.push(`🧾 Total de ${m.length} transações registradas em ${now.toLocaleDateString("pt-BR", { month: "long" })}.`);

  if (balance < 0) {
    warnings.push(pick([
      `🚨 Você está no negativo. Comece cortando "${top?.[0] ?? "a maior categoria"}".`,
      `⚠️ Déficit detectado. "${top?.[0] ?? "Sua maior categoria"}" merece atenção urgente.`,
    ]));
  }
  if (savingsRate < 10 && income > 0) {
    warnings.push(pick([
      `⚠️ Sua poupança ficou abaixo de 10% — o ideal são 20% ou mais.`,
      `📉 Apenas ${savingsRate.toFixed(0)}% guardado. Vamos subir esse número!`,
    ]));
  }
  if (top && top[1] > income * 0.4 && income > 0) {
    warnings.push(`⚠️ "${top[0]}" consumiu mais de 40% da sua renda. Reavalie.`);
  }

  if (savingsRate >= 20) tips.push(pick(TIPS_HEALTHY));
  else if (income > 0) tips.push(pick(TIPS_LOW_SAVINGS));
  tips.push(pick(TIPS_GENERIC));
  if (income === 0) tips.push("📥 Você não registrou receitas este mês. Adicione seu salário pra ter uma visão real.");

  let score = 50;
  if (savingsRate >= 30) score = 90 + Math.floor(Math.random() * 8);
  else if (savingsRate >= 20) score = 78 + Math.floor(Math.random() * 8);
  else if (savingsRate >= 10) score = 62 + Math.floor(Math.random() * 8);
  else if (savingsRate >= 0) score = 48 + Math.floor(Math.random() * 8);
  else score = Math.max(10, 45 + Math.round(savingsRate));

  return { summary, insights, warnings, tips, score: Math.round(score) };
};
