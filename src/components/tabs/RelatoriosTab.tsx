import { useMemo, useRef } from "react";
import { Timestamp } from "firebase/firestore";
import { Image as ImageIcon, Crown } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";

interface Tx {
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
  memberSince?: Date;
}

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const RelatoriosTab = ({ txs, premium, onUpgrade, memberSince }: Props) => {
  const stats = useMemo(() => {
    const income = txs.filter((t) => t.type === "income");
    const expense = txs.filter((t) => t.type === "expense");
    const totalIn = income.reduce((s, t) => s + t.amount, 0);
    const totalOut = expense.reduce((s, t) => s + t.amount, 0);
    const balance = totalIn - totalOut;

    const now = new Date();
    const m = txs.filter((t) => {
      const d = t.createdAt?.toDate();
      return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const monthIn = m.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const monthOut = m.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

    const maxIn = income.reduce((mx, t) => Math.max(mx, t.amount), 0);
    const maxOut = expense.reduce((mx, t) => Math.max(mx, t.amount), 0);

    // Avg expense per month (over months with expenses)
    const monthsMap = new Map<string, number>();
    expense.forEach((t) => {
      const d = t.createdAt?.toDate();
      if (!d) return;
      const k = `${d.getFullYear()}-${d.getMonth()}`;
      monthsMap.set(k, (monthsMap.get(k) ?? 0) + t.amount);
    });
    const avgMonth = monthsMap.size > 0
      ? Array.from(monthsMap.values()).reduce((s, v) => s + v, 0) / monthsMap.size
      : 0;

    // Category breakdown of THIS month
    const byCat: Record<string, number> = {};
    m.filter((t) => t.type === "expense").forEach((t) => {
      byCat[t.category] = (byCat[t.category] ?? 0) + t.amount;
    });
    const cats = Object.entries(byCat).map(([name, value]) => ({
      name, value, pct: monthOut > 0 ? (value / monthOut) * 100 : 0,
    })).sort((a, b) => b.value - a.value);

    return { totalIn, totalOut, balance, monthIn, monthOut, maxIn, maxOut, avgMonth, count: txs.length, cats };
  }, [txs]);

  const reportRef = useRef<HTMLDivElement>(null);

  const exportImage = async () => {
    if (!premium) return onUpgrade();
    if (!reportRef.current) return;
    toast.loading("Gerando imagem...", { id: "img" });
    try {
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: "#06070d",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `financas-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Imagem salva!", { id: "img" });
    } catch (e) {
      toast.error("Erro ao gerar imagem", { id: "img" });
    }
  };

  const monthLabel = new Date().toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Relatórios</h1>
          <p className="text-xs text-muted-foreground">Visão geral das suas finanças</p>
        </div>
        <button onClick={exportImage}
          className="px-4 py-2.5 rounded-xl font-bold text-sm bg-foreground text-background flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4" /> Salvar foto
        </button>
      </div>

      <div ref={reportRef} className="space-y-3 p-3 -m-3 rounded-2xl" style={{ background: "hsl(var(--background))" }}>
        <div className="text-center pb-1 pt-1">
          <p className="font-display text-lg font-extrabold">Meu relatório financeiro</p>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="surface-card p-4 border border-accent/30" style={{ background: "hsl(var(--accent) / 0.05)" }}>
            <p className="font-mono text-[9px] uppercase tracking-widest text-accent">Patrimônio total</p>
            <p className="text-xl font-extrabold text-accent">{fmt(stats.balance)}</p>
          </div>
          <div className="surface-card p-4 border border-primary/30" style={{ background: "hsl(var(--primary) / 0.05)" }}>
            <p className="font-mono text-[9px] uppercase tracking-widest text-primary">Saldo do mês</p>
            <p className="text-xl font-extrabold text-primary">{fmt(stats.monthIn - stats.monthOut)}</p>
          </div>
          <div className="surface-card p-4 border border-primary/20" style={{ background: "hsl(var(--primary) / 0.04)" }}>
            <p className="font-mono text-[9px] uppercase tracking-widest text-primary">Total recebido</p>
            <p className="text-lg font-extrabold text-primary">{fmt(stats.totalIn)}</p>
          </div>
          <div className="surface-card p-4 border border-destructive/20" style={{ background: "hsl(var(--destructive) / 0.04)" }}>
            <p className="font-mono text-[9px] uppercase tracking-widest text-destructive">Total gasto</p>
            <p className="text-lg font-extrabold text-destructive">{fmt(stats.totalOut)}</p>
          </div>
        </div>

        <section className="surface-card p-5">
          <p className="text-sm font-bold mb-3">Despesas por categoria — {monthLabel}</p>
          {stats.cats.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">Sem despesas neste mês.</p>
          ) : (
            <ul className="space-y-3">
              {stats.cats.map((c) => (
                <li key={c.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold flex items-center gap-1.5">📦 {c.name}</span>
                    <span className="font-mono text-[10px]">
                      <span className="text-muted-foreground">{c.pct.toFixed(1)}%</span>
                      <span className="font-bold text-foreground ml-2">{fmt(c.value)}</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full" style={{
                      width: `${c.pct}%`,
                      background: "var(--gradient-btn-primary)",
                    }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Lista de transações na imagem (até 15 mais recentes) */}
        {txs.length > 0 && (
          <section className="surface-card p-5">
            <p className="text-sm font-bold mb-3">Últimas transações</p>
            <ul className="space-y-2">
              {txs.slice(0, 15).map((t, i) => (
                <li key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{t.description}</p>
                    <p className="font-mono text-[9px] text-muted-foreground">
                      {t.category} · {t.createdAt?.toDate().toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <p className={`font-bold ${t.type === "income" ? "text-primary" : "text-destructive"}`}>
                    {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="surface-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-sm font-bold">📊 Estatísticas avançadas</p>
            {!premium && <span className="font-mono text-[9px] px-2 py-0.5 rounded-full premium-crown-badge">PREMIUM</span>}
          </div>
          <ul className={`space-y-3 ${!premium ? "opacity-40 pointer-events-none select-none" : ""}`}>
            <li className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Maior receita registrada</span><span className="font-bold">{fmt(stats.maxIn)}</span></li>
            <li className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Maior despesa registrada</span><span className="font-bold">{fmt(stats.maxOut)}</span></li>
            <li className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Média de gasto/mês</span><span className="font-bold">{fmt(stats.avgMonth)}</span></li>
            <li className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Total de transações</span><span className="font-bold">{stats.count} lançamentos</span></li>
            <li className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Membro desde</span>
              <span className="font-bold">{memberSince ? memberSince.toLocaleDateString("pt-BR") : "—"}</span>
            </li>
          </ul>
          {!premium && (
            <button onClick={onUpgrade}
              className="mt-3 w-full py-2.5 rounded-xl text-xs font-bold border border-gold/40 text-gold hover:bg-gold/10 transition">
              🔓 Desbloquear estatísticas
            </button>
          )}
        </section>
      </div>
    </div>
  );
};

export default RelatoriosTab;
