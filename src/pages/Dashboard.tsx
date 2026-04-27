import { useEffect, useMemo, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeUser } from "@/lib/premium";
import { formatBRLInput, parseBRL } from "@/lib/format";
import { toast } from "sonner";
import PremiumModal from "@/components/PremiumModal";
import AIAdvisor from "@/components/AIAdvisor";
import {
  Wallet,
  LogOut,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Crown,
  Sparkles,
  Target,
  PieChart,
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Activity,
} from "lucide-react";

type TxType = "income" | "expense";
interface Tx {
  id: string;
  type: TxType;
  amount: number;
  description: string;
  category: string;
  createdAt?: Timestamp;
}

const CATEGORIES: Record<TxType, string[]> = {
  income: ["Salário", "Freelance", "Investimento", "Outro"],
  expense: ["Alimentação", "Transporte", "Moradia", "Lazer", "Saúde", "Outro"],
};

const fmtBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [txs, setTxs] = useState<Tx[]>([]);
  const [type, setType] = useState<TxType>("expense");
  const [amountMasked, setAmountMasked] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState(CATEGORIES.expense[0]);
  const [busy, setBusy] = useState(false);
  const [premium, setPremium] = useState(false);
  const [showPremium, setShowPremium] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "transactions"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setTxs(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Tx[]);
      },
      (err) => {
        console.error(err);
        toast.error("Erro ao carregar transações");
      }
    );
    return unsub;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeUser(user.uid, (u) => setPremium(!!u.premium));
    return unsub;
  }, [user]);

  useEffect(() => {
    setCat(CATEGORIES[type][0]);
  }, [type]);

  const income = txs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  // This month stats
  const thisMonth = useMemo(() => {
    const now = new Date();
    const m = txs.filter((t) => {
      const d = t.createdAt?.toDate();
      return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const inc = m.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const exp = m.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { count: m.length, inc, exp };
  }, [txs]);

  const topCategory = useMemo(() => {
    const map: Record<string, number> = {};
    txs.filter((t) => t.type === "expense").forEach((t) => {
      map[t.category] = (map[t.category] ?? 0) + t.amount;
    });
    const top = Object.entries(map).sort((a, b) => b[1] - a[1])[0];
    return top ? { name: top[0], value: top[1] } : null;
  }, [txs]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const a = parseBRL(amountMasked);
    if (!a || a <= 0) return toast.error("Valor inválido");
    if (!desc.trim()) return toast.error("Adicione uma descrição");
    setBusy(true);
    try {
      await addDoc(collection(db, "transactions"), {
        uid: user.uid,
        type,
        amount: a,
        description: desc.trim(),
        category: cat,
        createdAt: serverTimestamp(),
      });
      setAmountMasked("");
      setDesc("");
      toast.success(type === "income" ? "Receita adicionada" : "Despesa adicionada");
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao salvar");
    } finally {
      setBusy(false);
    }
  };

  const del = async (id: string) => {
    try {
      await deleteDoc(doc(db, "transactions", id));
      toast.success("Removido");
    } catch {
      toast.error("Erro ao remover");
    }
  };

  const balanceClass =
    balance > 0 ? "text-primary" : balance < 0 ? "text-destructive" : "text-foreground";

  return (
    <main className="max-w-md mx-auto px-4 pt-6 pb-20 relative z-10 animate-fade-in">
      {/* Header */}
      <header className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center glow-primary"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Finanças <span className="text-primary">Pro</span>
          </h1>
        </div>
        {premium ? (
          <span className="font-mono text-[11px] px-2.5 py-1 rounded-full text-background flex items-center gap-1" style={{ background: "var(--gradient-gold)" }}>
            <Crown className="w-3 h-3" /> PREMIUM
          </span>
        ) : (
          <span className="font-mono text-[11px] px-2.5 py-1 rounded-full border border-white/10 text-muted-foreground bg-card">
            FREE
          </span>
        )}
      </header>

      {/* User card */}
      <section className="surface-card !rounded-2xl px-4 py-3 mb-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-[10px] surface-2 flex items-center justify-center text-base flex-shrink-0">
          {user?.isAnonymous ? "👤" : "✉️"}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
            {user?.isAnonymous ? "ID Anônimo" : "Logado como"}
          </p>
          <p className="font-mono text-[11px] truncate">
            {user?.email ?? user?.uid.slice(0, 18) + "…"}
          </p>
        </div>
        <button
          onClick={() => logout()}
          className="font-mono text-[10px] px-2.5 py-1.5 border border-white/10 rounded-lg text-muted-foreground hover:text-destructive hover:border-destructive transition flex items-center gap-1"
        >
          <LogOut className="w-3 h-3" /> Sair
        </button>
      </section>

      {/* Balance */}
      <section
        className="balance-bg rounded-3xl p-7 mb-4 relative overflow-hidden border"
        style={{ borderColor: "hsl(var(--accent) / 0.2)" }}
      >
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, transparent 70%)" }}
        />
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-2 relative">
          Saldo atual
        </p>
        <p className={`text-[42px] font-extrabold tracking-tighter leading-none mb-5 relative transition-colors ${balanceClass}`}>
          {fmtBRL(balance)}
        </p>
        <div className="grid grid-cols-2 gap-3 relative">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Receitas</p>
            <p className="text-lg font-bold text-primary">{fmtBRL(income)}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Despesas</p>
            <p className="text-lg font-bold text-destructive">{fmtBRL(expense)}</p>
          </div>
        </div>
      </section>

      {/* Quick stats — 4 cards now */}
      <section className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="surface-card !rounded-2xl p-4 flex flex-col gap-1.5">
          <TrendingUp className="w-5 h-5 text-primary" />
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Transações</p>
          <p className="text-base font-bold">{txs.length}</p>
        </div>
        <div className="surface-card !rounded-2xl p-4 flex flex-col gap-1.5">
          <PieChart className="w-5 h-5 text-accent" />
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Categorias</p>
          <p className="text-base font-bold">{new Set(txs.map((t) => t.category)).size}</p>
        </div>
        <div className="surface-card !rounded-2xl p-4 flex flex-col gap-1.5">
          <Calendar className="w-5 h-5 text-primary" />
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Este mês</p>
          <p className="text-base font-bold">{thisMonth.count}</p>
        </div>
        <div className="surface-card !rounded-2xl p-4 flex flex-col gap-1.5">
          <Activity className="w-5 h-5 text-gold" />
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Top categoria</p>
          <p className="text-sm font-bold truncate">{topCategory?.name ?? "—"}</p>
        </div>
      </section>

      {/* Monthly summary */}
      <section className="surface-card p-5 mb-4">
        <h2 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Resumo do mês
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Receitas</p>
            <p className="text-base font-bold text-primary">{fmtBRL(thisMonth.inc)}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Despesas</p>
            <p className="text-base font-bold text-destructive">{fmtBRL(thisMonth.exp)}</p>
          </div>
          <div className="col-span-2 pt-3 border-t border-white/5">
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Saldo do mês</p>
            <p className={`text-xl font-extrabold ${thisMonth.inc - thisMonth.exp >= 0 ? "text-primary" : "text-destructive"}`}>
              {fmtBRL(thisMonth.inc - thisMonth.exp)}
            </p>
          </div>
        </div>
      </section>

      {/* AI Advisor (locked unless premium) */}
      <AIAdvisor txs={txs} premium={premium} onUpgrade={() => setShowPremium(true)} />

      {/* Premium upgrade banner (hide if already premium) */}
      {!premium && (
        <button
          onClick={() => setShowPremium(true)}
          className="gold-bg w-full rounded-2xl px-5 py-4 mb-4 flex items-center gap-3.5 cursor-pointer relative overflow-hidden border transition-colors hover:border-gold/50"
          style={{ borderColor: "hsl(var(--gold) / 0.25)" }}
        >
          <div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full"
            style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.1) 0%, transparent 70%)" }}
          />
          <Crown className="w-7 h-7 text-gold flex-shrink-0 relative" />
          <div className="flex-1 text-left relative">
            <p className="text-sm font-bold text-gold mb-0.5">Desbloquear Premium</p>
            <p className="font-mono text-[10px]" style={{ color: "hsl(var(--gold) / 0.6)" }}>
              IA, metas, relatórios, exportação e mais
            </p>
          </div>
          <Sparkles className="w-4 h-4 text-gold opacity-60 relative" />
        </button>
      )}

      {/* Add transaction */}
      <section className="surface-card p-5 mb-4">
        <h2 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova transação
        </h2>

        <form onSubmit={add} className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType("income")}
              className={`py-3 rounded-[10px] border text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                type === "income"
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-secondary border-white/10 text-muted-foreground"
              }`}
            >
              <ArrowUpCircle className="w-4 h-4" /> Receita
            </button>
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`py-3 rounded-[10px] border text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                type === "expense"
                  ? "bg-destructive/10 border-destructive text-destructive"
                  : "bg-secondary border-white/10 text-muted-foreground"
              }`}
            >
              <ArrowDownCircle className="w-4 h-4" /> Despesa
            </button>
          </div>

          <input
            type="text"
            inputMode="numeric"
            placeholder="R$ 0,00"
            value={amountMasked}
            onChange={(e) => setAmountMasked(formatBRLInput(e.target.value))}
            className="input-styled font-mono"
          />
          <input
            type="text"
            placeholder="Descrição"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="input-styled"
          />

          <div className="flex gap-1.5 flex-wrap pt-1">
            {CATEGORIES[type].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`px-3 py-1 rounded-full border font-mono text-[11px] transition ${
                  cat === c
                    ? "border-primary text-primary bg-primary/10"
                    : "border-white/10 text-muted-foreground bg-secondary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-primary-foreground tracking-wide transition-all hover:-translate-y-px disabled:opacity-50 mt-2"
            style={{ background: "var(--gradient-btn-primary)", boxShadow: "var(--shadow-card)" }}
          >
            Adicionar
          </button>
        </form>
      </section>

      {/* Transactions */}
      <section className="surface-card p-5">
        <h2 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <Target className="w-4 h-4" /> Histórico
        </h2>

        {txs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingDown className="w-10 h-10 mx-auto mb-2.5 opacity-40" />
            <p className="font-mono text-xs tracking-wider">Nenhuma transação ainda</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {txs.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 p-3 surface-2 rounded-xl animate-slide-in hover:border-white/20 transition"
              >
                <div
                  className={`w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 ${
                    t.type === "income" ? "bg-primary/10" : "bg-destructive/10"
                  }`}
                >
                  {t.type === "income" ? (
                    <ArrowUpCircle className="w-4 h-4 text-primary" />
                  ) : (
                    <ArrowDownCircle className="w-4 h-4 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{t.description}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{t.category}</p>
                </div>
                <p
                  className={`font-mono text-sm font-medium flex-shrink-0 ${
                    t.type === "income" ? "text-primary" : "text-destructive"
                  }`}
                >
                  {t.type === "income" ? "+" : "−"}
                  {fmtBRL(t.amount)}
                </p>
                <button
                  onClick={() => del(t.id)}
                  className="text-muted-foreground hover:text-destructive p-1 transition"
                  aria-label="Remover"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <PremiumModal open={showPremium} onClose={() => setShowPremium(false)} />
    </main>
  );
};

export default Dashboard;
