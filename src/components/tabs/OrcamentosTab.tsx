import { useEffect, useMemo, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { Crown, Wallet, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Budget, getBudgets, removeBudget, upsertBudget } from "@/lib/budgets";
import { formatBRLInput, parseBRL } from "@/lib/format";

interface Tx {
  type: "income" | "expense";
  amount: number;
  category: string;
  createdAt?: Timestamp;
}

interface Props {
  uid: string;
  txs: Tx[];
  premium: boolean;
  onUpgrade: () => void;
}

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const OrcamentosTab = ({ uid, txs, premium, onUpgrade }: Props) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [cat, setCat] = useState("");
  const [limit, setLimit] = useState("");

  useEffect(() => { if (premium) setBudgets(getBudgets(uid)); }, [uid, premium]);

  const monthExpenseByCat = useMemo(() => {
    const now = new Date();
    const map: Record<string, number> = {};
    txs.filter((t) => {
      const d = t.createdAt?.toDate();
      return d && t.type === "expense" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).forEach((t) => { map[t.category] = (map[t.category] ?? 0) + t.amount; });
    return map;
  }, [txs]);

  if (!premium) {
    return (
      <button onClick={onUpgrade}
        className="surface-card w-full p-8 text-left hover:border-gold/40 transition-colors">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "hsl(var(--gold) / 0.12)" }}>
          <Wallet className="w-7 h-7 text-gold" />
        </div>
        <h2 className="text-xl font-extrabold mb-2 flex items-center gap-2">
          Orçamentos por categoria <Crown className="w-4 h-4 text-gold" />
        </h2>
        <p className="font-mono text-[10px] text-gold uppercase tracking-widest mb-3">Recurso Premium</p>
        <p className="text-sm text-muted-foreground">
          🔒 Defina um teto de gastos por categoria e receba alertas quando se aproximar do limite.
        </p>
      </button>
    );
  }

  const submit = () => {
    const c = cat.trim();
    const v = parseBRL(limit);
    if (!c) return toast.error("Informe a categoria");
    if (v <= 0) return toast.error("Valor inválido");
    upsertBudget(uid, { category: c, limit: v });
    setBudgets(getBudgets(uid));
    setCat(""); setLimit(""); setShowForm(false);
    toast.success("Orçamento salvo!");
  };

  const remove = (c: string) => {
    removeBudget(uid, c);
    setBudgets(getBudgets(uid));
  };

  // Suggested categories (from existing expenses)
  const existingCats = Array.from(new Set(Object.keys(monthExpenseByCat)));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Orçamentos</h1>
          <p className="text-xs text-muted-foreground">Tetos mensais por categoria</p>
        </div>
        <button onClick={() => setShowForm((s) => !s)}
          className="px-4 py-2.5 rounded-xl font-bold text-sm bg-foreground text-background flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Novo
        </button>
      </div>

      {showForm && (
        <div className="surface-card p-5 space-y-3 animate-slide-in border-primary/30">
          <input value={cat} onChange={(e) => setCat(e.target.value)}
            placeholder="Categoria (ex: Alimentação)" className="input-styled" />
          {existingCats.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {existingCats.map((c) => (
                <button key={c} onClick={() => setCat(c)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-secondary border border-white/10 hover:border-primary/50">
                  {c}
                </button>
              ))}
            </div>
          )}
          <input type="text" inputMode="numeric" value={limit}
            onChange={(e) => setLimit(formatBRLInput(e.target.value))}
            placeholder="Limite mensal (R$)" className="input-styled font-mono" />
          <button onClick={submit}
            className="w-full py-3 rounded-xl font-bold text-sm text-primary-foreground"
            style={{ background: "var(--gradient-btn-primary)" }}>
            Salvar orçamento
          </button>
        </div>
      )}

      {budgets.length === 0 ? (
        <div className="surface-card p-8 text-center">
          <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-sm text-muted-foreground">Nenhum orçamento criado ainda.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {budgets.map((b) => {
            const used = monthExpenseByCat[b.category] ?? 0;
            const pct = (used / b.limit) * 100;
            const danger = pct >= 100;
            const warn = pct >= 80 && pct < 100;
            return (
              <div key={b.category} className="surface-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold">{b.category}</p>
                  <button onClick={() => remove(b.category)}
                    className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-baseline justify-between mb-2">
                  <p className={`text-lg font-extrabold ${danger ? "text-destructive" : warn ? "text-gold" : "text-foreground"}`}>
                    {fmt(used)}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground">de {fmt(b.limit)}</p>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full transition-all"
                    style={{
                      width: `${Math.min(100, pct)}%`,
                      background: danger
                        ? "hsl(var(--destructive))"
                        : warn ? "hsl(var(--gold))" : "var(--gradient-btn-primary)",
                    }} />
                </div>
                <p className="font-mono text-[10px] text-muted-foreground mt-1.5">
                  {danger ? `🚨 Estourou em ${fmt(used - b.limit)}` :
                   warn ? `⚠️ ${pct.toFixed(0)}% usado` :
                   `${pct.toFixed(0)}% usado · sobra ${fmt(b.limit - used)}`}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrcamentosTab;
