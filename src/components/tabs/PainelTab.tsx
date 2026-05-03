import { useMemo, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { Sparkles, RefreshCw, Bot, Crown, TrendingUp, TrendingDown, Calendar, Loader2 } from "lucide-react";
import { analyzeMonth, SmartTx } from "@/lib/smartAI";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CategoryChart from "@/components/CategoryChart";

interface Tx {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  createdAt?: Timestamp;
}

interface Props {
  txs: Tx[];
  premium: boolean;
  onUpgrade: () => void;
}

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const PainelTab = ({ txs, premium, onUpgrade }: Props) => {
  const [analysis, setAnalysis] = useState(() => analyzeMonth(txs as SmartTx[]));
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const runAIAnalysis = async () => {
    setAiLoading(true);
    setAiOpen(true);
    try {
      const now = new Date();
      const month = now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
      const monthTxs = txs
        .filter((t) => {
          const d = t.createdAt?.toDate();
          return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .map((t) => ({ type: t.type, amount: t.amount, category: t.category, description: t.description }));

      const { data, error } = await supabase.functions.invoke("ai-analysis", {
        body: { transactions: monthTxs, month },
      });

      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        setAnalysis(analyzeMonth(txs as SmartTx[]));
        return;
      }
      setAnalysis({
        summary: data.summary ?? "",
        insights: data.insights ?? [],
        warnings: data.warnings ?? [],
        tips: data.tips ?? [],
        score: data.score ?? 50,
      });
    } catch (e) {
      console.error(e);
      toast.error("Falha ao analisar com IA. Usando análise local.");
      setAnalysis(analyzeMonth(txs as SmartTx[]));
    } finally {
      setAiLoading(false);
    }
  };

  const income = txs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  const thisMonth = useMemo(() => {
    const now = new Date();
    const m = txs.filter((t) => {
      const d = t.createdAt?.toDate();
      return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const inc = m.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const exp = m.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { inc, exp, count: m.length };
  }, [txs]);

  // Build last 6 months bar chart
  const monthly = useMemo(() => {
    const now = new Date();
    const arr: { label: string; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const total = txs
        .filter((t) => {
          const td = t.createdAt?.toDate();
          return td && td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear() && t.type === "expense";
        })
        .reduce((s, t) => s + t.amount, 0);
      arr.push({
        label: d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
        total,
      });
    }
    return arr;
  }, [txs]);

  const maxBar = Math.max(...monthly.map((m) => m.total), 1);
  const recent = txs.slice(0, 4);
  const savingsRate = thisMonth.inc > 0 ? ((thisMonth.inc - thisMonth.exp) / thisMonth.inc) * 100 : 0;

  return (
    <div className="space-y-3 pb-4">
      {/* Big balance */}
      <section className="balance-bg rounded-3xl p-6 relative overflow-hidden border border-accent/20">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full"
          style={{ background: premium
            ? "radial-gradient(circle, hsl(var(--gold) / 0.18) 0%, transparent 70%)"
            : "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)" }} />
        <div className="flex items-center justify-between mb-2 relative">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Patrimônio total</p>
          {premium && (
            <span className="font-mono text-[10px] px-2.5 py-1 rounded-full premium-crown-badge flex items-center gap-1">
              <Crown className="w-3 h-3" /> Premium
            </span>
          )}
        </div>
        <p className={`text-[40px] font-display font-extrabold tracking-tighter leading-none mb-5 relative ${
          premium ? "gradient-text-gold" : "text-foreground"
        }`}>
          {fmt(balance)}
        </p>
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 relative">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Receitas (mês)</p>
            <p className="text-sm font-bold text-primary flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" />{fmt(thisMonth.inc)}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Despesas</p>
            <p className="text-sm font-bold text-destructive flex items-center gap-1"><TrendingDown className="w-3.5 h-3.5" />{fmt(thisMonth.exp)}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Saldo</p>
            <p className={`text-sm font-bold ${thisMonth.inc - thisMonth.exp >= 0 ? "text-primary" : "text-destructive"}`}>
              ✓ {fmt(thisMonth.inc - thisMonth.exp)}
            </p>
          </div>
        </div>
      </section>

      {/* Monthly bar chart + Categories pie */}
      <div className="grid grid-cols-2 gap-3">
        <div className="surface-card p-4">
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-3">Gastos por mês</p>
          <div className="flex items-end gap-1.5 h-24">
            {monthly.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${(m.total / maxBar) * 100}%`,
                    minHeight: "4px",
                    background: i === monthly.length - 1
                      ? "var(--gradient-btn-primary)"
                      : "hsl(var(--secondary))",
                  }}
                  title={fmt(m.total)}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 mt-1.5">
            {monthly.map((m, i) => (
              <p key={i} className="flex-1 font-mono text-[8px] text-center text-muted-foreground truncate">{m.label}</p>
            ))}
          </div>
        </div>
        <div className="surface-card p-4">
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-3">Categorias</p>
          <CategoryChart txs={txs} premium={premium} onUpgrade={onUpgrade} compact />
        </div>
      </div>

      {/* AI Analysis */}
      <section className="surface-card p-5 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full"
          style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.10) 0%, transparent 70%)" }} />
        <div className="flex items-center justify-between mb-3 relative">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center"
              style={{ background: premium ? "var(--gradient-btn-gold)" : "hsl(var(--secondary))" }}>
              <Bot className={`w-4 h-4 ${premium ? "text-background" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="text-sm font-bold flex items-center gap-1.5">
                Análise de IA <Sparkles className="w-3 h-3 text-gold" />
              </p>
              <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
                {premium ? "Disponível" : "Premium"}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (!premium) return onUpgrade();
              if (!aiLoading) runAIAnalysis();
            }}
            disabled={aiLoading}
            className="px-3.5 py-2 rounded-lg text-xs font-bold text-background flex items-center gap-1.5 disabled:opacity-60"
            style={{ background: "var(--gradient-btn-gold)" }}
          >
            {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            {aiLoading ? "Analisando..." : "Analisar com IA"}
          </button>
        </div>
        {aiOpen && premium && (
          <div className="space-y-3 relative animate-fade-in">
            <p className="text-sm leading-relaxed">{analysis.summary}</p>
            <div className="surface-2 rounded-xl p-3">
              <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Health Score</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                  <div className="h-full transition-all"
                    style={{
                      width: `${analysis.score}%`,
                      background: analysis.score >= 70 ? "var(--gradient-btn-primary)" : analysis.score >= 40 ? "hsl(var(--gold))" : "hsl(var(--destructive))",
                    }} />
                </div>
                <p className="font-bold text-sm">{analysis.score}/100</p>
              </div>
            </div>
            {analysis.warnings.map((w, i) => (
              <p key={i} className="text-xs leading-relaxed text-destructive">{w}</p>
            ))}
            {analysis.insights.map((ins, i) => (
              <p key={i} className="text-xs leading-relaxed text-muted-foreground">{ins}</p>
            ))}
            {analysis.tips.map((t, i) => (
              <p key={i} className="text-xs leading-relaxed text-gold">💡 {t}</p>
            ))}
          </div>
        )}
      </section>

      {/* Savings rate */}
      <section className="surface-card p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold">Taxa de poupança</p>
          <p className={`text-sm font-extrabold ${savingsRate >= 20 ? "text-primary" : savingsRate >= 0 ? "text-gold" : "text-destructive"}`}>
            {savingsRate.toFixed(0)}%
          </p>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div className="h-full transition-all"
            style={{
              width: `${Math.max(0, Math.min(100, savingsRate))}%`,
              background: savingsRate >= 20 ? "var(--gradient-btn-primary)" : "hsl(var(--gold))",
            }} />
        </div>
      </section>

      {/* Recent */}
      <section className="surface-card p-4">
        <p className="text-sm font-bold mb-3">Recentes</p>
        {recent.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-3">Nenhuma transação ainda.</p>
        ) : (
          <ul className="space-y-2">
            {recent.map((t) => (
              <li key={t.id} className="flex items-center gap-3 p-2.5 surface-2 rounded-xl">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: t.type === "income" ? "hsl(var(--primary) / 0.15)" : "hsl(var(--destructive) / 0.10)" }}>
                  {t.type === "income" ? "💡" : "📦"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{t.description}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {t.category} · {t.createdAt?.toDate().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
                <p className={`font-bold text-sm ${t.type === "income" ? "text-primary" : "text-destructive"}`}>
                  {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default PainelTab;
