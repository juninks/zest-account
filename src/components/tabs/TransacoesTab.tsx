import { useEffect, useMemo, useState } from "react";
import { Timestamp, addDoc, collection, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { Plus, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { formatBRLInput, parseBRL } from "@/lib/format";
import { addCustomCategory, getCustomCategories } from "@/lib/customCategories";
import { FREE_MONTHLY_TX_LIMIT, countThisMonth } from "@/lib/limits";

type TxType = "income" | "expense";
interface Tx {
  id: string;
  type: TxType;
  amount: number;
  description: string;
  category: string;
  createdAt?: Timestamp;
}

const BASE: Record<TxType, string[]> = {
  income: ["Salário", "Freelance", "Renda Extra", "Investimento", "Outros"],
  expense: ["Alimentação", "Transporte", "Moradia", "Lazer", "Saúde", "Outros"],
};

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Props {
  uid: string;
  txs: Tx[];
  premium: boolean;
  onUpgrade: () => void;
}

const TransacoesTab = ({ uid, txs, premium, onUpgrade }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<TxType>("expense");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState("Outros");
  const [busy, setBusy] = useState(false);
  const [customCats, setCustomCats] = useState<string[]>([]);
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  useEffect(() => {
    if (!premium) { setCustomCats([]); return; }
    setCustomCats(getCustomCategories(uid, type));
  }, [uid, type, premium]);

  useEffect(() => { setCat(BASE[type][0]); }, [type]);

  const allCats = useMemo(() => [...BASE[type], ...customCats], [type, customCats]);
  const income = txs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const monthly = countThisMonth(txs);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!premium && monthly >= FREE_MONTHLY_TX_LIMIT) {
      onUpgrade();
      return toast.error(`Limite Free atingido (${FREE_MONTHLY_TX_LIMIT}/mês)`);
    }
    const a = parseBRL(amount);
    if (!a || a <= 0) return toast.error("Valor inválido");
    if (!desc.trim()) return toast.error("Adicione uma descrição");
    setBusy(true);
    try {
      await addDoc(collection(db, "transactions"), {
        uid, type, amount: a, description: desc.trim(), category: cat,
        createdAt: serverTimestamp(),
      });
      setAmount(""); setDesc(""); setShowForm(false);
      toast.success(type === "income" ? "Receita adicionada" : "Despesa adicionada");
    } catch (err: any) {
      toast.error(err.message ?? "Erro");
    } finally {
      setBusy(false);
    }
  };

  const addCat = () => {
    if (!premium) return onUpgrade();
    const n = newCatName.trim();
    if (!n) return;
    if (allCats.some((c) => c.toLowerCase() === n.toLowerCase())) return toast.error("Já existe");
    addCustomCategory(uid, type, n);
    setCustomCats(getCustomCategories(uid, type));
    setCat(n); setNewCatName(""); setShowAddCat(false);
    toast.success("Categoria criada!");
  };

  const del = async (id: string) => {
    try {
      await deleteDoc(doc(db, "transactions", id));
      toast.success("Removido");
    } catch {
      toast.error("Erro ao remover");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Transações</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="px-4 py-2.5 rounded-xl font-bold text-sm bg-foreground text-background flex items-center gap-1.5"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Fechar" : "Nova"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="surface-card p-3 border border-primary/20" style={{ background: "hsl(var(--primary) / 0.05)" }}>
          <p className="font-mono text-[9px] uppercase tracking-widest text-primary">Receitas</p>
          <p className="text-lg font-extrabold text-primary">{fmt(income)}</p>
        </div>
        <div className="surface-card p-3 border border-destructive/20" style={{ background: "hsl(var(--destructive) / 0.05)" }}>
          <p className="font-mono text-[9px] uppercase tracking-widest text-destructive">Despesas</p>
          <p className="text-lg font-extrabold text-destructive">{fmt(expense)}</p>
        </div>
      </div>

      {showForm && (
        <form onSubmit={submit} className="surface-card p-5 space-y-3 animate-slide-in border-primary/30">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setType("income")}
              className={`py-2.5 rounded-xl text-xs font-bold border transition ${type === "income" ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-muted-foreground"}`}>
              + Receita
            </button>
            <button type="button" onClick={() => setType("expense")}
              className={`py-2.5 rounded-xl text-xs font-bold border transition ${type === "expense" ? "border-destructive bg-destructive/10 text-destructive" : "border-white/10 text-muted-foreground"}`}>
              − Despesa
            </button>
          </div>
          <input type="text" inputMode="numeric" value={amount}
            onChange={(e) => setAmount(formatBRLInput(e.target.value))}
            placeholder="R$ 0,00" className="input-styled font-mono text-lg" />
          <input value={desc} onChange={(e) => setDesc(e.target.value)}
            placeholder="Descrição" className="input-styled" />
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-1.5">Categoria</p>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {allCats.map((c) => (
                <button type="button" key={c} onClick={() => setCat(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border transition ${
                    cat === c ? "border-primary bg-primary/10 text-primary" : "border-white/10 bg-secondary text-muted-foreground"
                  }`}>
                  {c}
                </button>
              ))}
              <button type="button" onClick={() => setShowAddCat(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-secondary border border-gold/30 text-gold whitespace-nowrap">
                + Nova
              </button>
            </div>
            {showAddCat && (
              <div className="flex gap-2 mt-2">
                <input autoFocus value={newCatName} onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Nome da categoria" className="input-styled text-sm" />
                <button type="button" onClick={addCat}
                  className="px-3 rounded-lg bg-gold text-background"><Check className="w-4 h-4" /></button>
                <button type="button" onClick={() => { setShowAddCat(false); setNewCatName(""); }}
                  className="px-3 rounded-lg bg-secondary border border-white/10"><X className="w-4 h-4" /></button>
              </div>
            )}
          </div>
          <button type="submit" disabled={busy}
            className="w-full py-3 rounded-xl font-bold text-sm text-primary-foreground"
            style={{ background: "var(--gradient-btn-primary)" }}>
            {busy ? "Salvando..." : "Adicionar"}
          </button>
        </form>
      )}

      {txs.length === 0 ? (
        <div className="surface-card p-8 text-center">
          <p className="text-sm text-muted-foreground">Nenhuma transação ainda.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {txs.map((t) => (
            <li key={t.id} className="surface-card p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: t.type === "income" ? "hsl(var(--primary) / 0.15)" : "hsl(var(--destructive) / 0.10)" }}>
                {t.type === "income" ? "💡" : "📦"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{t.description}</p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  <span className="px-1.5 py-0.5 rounded bg-secondary mr-1">{t.category}</span>
                  {t.createdAt?.toDate().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
              <p className={`font-bold text-sm ${t.type === "income" ? "text-primary" : "text-destructive"}`}>
                {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
              </p>
              <button onClick={() => del(t.id)}
                className="w-7 h-7 rounded-lg text-muted-foreground hover:text-destructive flex items-center justify-center">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransacoesTab;
