import { useMemo } from "react";
import { PieChart, Crown } from "lucide-react";

interface Tx {
  type: "income" | "expense";
  amount: number;
  category: string;
}

interface Props {
  txs: Tx[];
  premium: boolean;
  onUpgrade: () => void;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--gold))",
  "hsl(var(--destructive))",
  "hsl(280 80% 60%)",
  "hsl(20 90% 60%)",
];

const fmtBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const CategoryChart = ({ txs, premium, onUpgrade }: Props) => {
  const data = useMemo(() => {
    const map: Record<string, number> = {};
    txs.filter((t) => t.type === "expense").forEach((t) => {
      map[t.category] = (map[t.category] ?? 0) + t.amount;
    });
    const total = Object.values(map).reduce((s, v) => s + v, 0);
    const list = Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], i) => ({
        name,
        value,
        pct: total > 0 ? (value / total) * 100 : 0,
        color: COLORS[i % COLORS.length],
      }));
    return { list, total };
  }, [txs]);

  if (!premium) {
    return (
      <button
        onClick={onUpgrade}
        className="surface-card w-full p-5 mb-4 text-left hover:border-gold/40 transition-colors"
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "hsl(var(--gold) / 0.12)" }}
          >
            <PieChart className="w-5 h-5 text-gold" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold flex items-center gap-1.5">
              Gráficos avançados <Crown className="w-3 h-3 text-gold" />
            </p>
            <p className="font-mono text-[10px] text-gold uppercase tracking-widest">
              Recurso Premium
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          🔒 Veja para onde vai seu dinheiro com gráficos visuais por categoria.
        </p>
      </button>
    );
  }

  if (data.list.length === 0) {
    return (
      <section className="surface-card p-5 mb-4">
        <h2 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
          <PieChart className="w-4 h-4" /> Gastos por categoria
        </h2>
        <p className="text-xs text-muted-foreground text-center py-4">
          Adicione despesas para ver seu gráfico.
        </p>
      </section>
    );
  }

  // Build conic-gradient string
  let acc = 0;
  const stops = data.list
    .map((d) => {
      const start = acc;
      acc += d.pct;
      return `${d.color} ${start}% ${acc}%`;
    })
    .join(", ");

  return (
    <section className="surface-card p-5 mb-4 border-gold/20">
      <h2 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
        <PieChart className="w-4 h-4 text-gold" /> Gastos por categoria
      </h2>

      <div className="flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <div
            className="w-28 h-28 rounded-full"
            style={{ background: `conic-gradient(${stops})` }}
          />
          <div className="absolute inset-3 rounded-full bg-card flex flex-col items-center justify-center">
            <p className="font-mono text-[9px] text-muted-foreground uppercase">Total</p>
            <p className="text-xs font-bold">{fmtBRL(data.total)}</p>
          </div>
        </div>

        <ul className="flex-1 space-y-1.5 min-w-0">
          {data.list.slice(0, 5).map((d) => (
            <li key={d.name} className="flex items-center gap-2 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: d.color }}
              />
              <span className="flex-1 truncate">{d.name}</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {d.pct.toFixed(0)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CategoryChart;
