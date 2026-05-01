import { useEffect, useMemo, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeUser } from "@/lib/premium";
import { isAdmin } from "@/lib/admin";
import { toast } from "sonner";
import {
  Wallet,
  LogOut,
  Crown,
  Shield,
  BarChart3,
  CreditCard,
  Target,
  Trophy,
  LineChart as LineIcon,
} from "lucide-react";
import PremiumModal from "@/components/PremiumModal";
import PainelTab from "@/components/tabs/PainelTab";
import TransacoesTab from "@/components/tabs/TransacoesTab";
import OrcamentosTab from "@/components/tabs/OrcamentosTab";
import MetasTab from "@/components/tabs/MetasTab";
import RelatoriosTab from "@/components/tabs/RelatoriosTab";
import { FREE_MONTHLY_TX_LIMIT, countThisMonth, remainingFree } from "@/lib/limits";

interface Tx {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  createdAt?: Timestamp;
}

const TABS = [
  { id: "painel", label: "Painel", icon: BarChart3 },
  { id: "transacoes", label: "Transações", icon: CreditCard },
  { id: "orcamentos", label: "Orçamentos", icon: Target },
  { id: "metas", label: "Metas", icon: Trophy },
  { id: "relatorios", label: "Relatórios", icon: LineIcon },
] as const;

type TabId = typeof TABS[number]["id"];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [txs, setTxs] = useState<Tx[]>([]);
  const [premium, setPremium] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [tab, setTab] = useState<TabId>("painel");

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "transactions"), where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Tx[];
      list.sort((a, b) => {
        const ta = a.createdAt?.toMillis?.() ?? Date.now();
        const tb = b.createdAt?.toMillis?.() ?? Date.now();
        return tb - ta;
      });
      setTxs(list);
    }, (err) => toast.error("Erro: " + err.message));
    return unsub;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    return subscribeUser(user.uid, (u) => setPremium(!!u.premium));
  }, [user]);

  // Notify when Free user reaches limit
  const monthlyCount = countThisMonth(txs);
  const remaining = remainingFree(txs);
  useEffect(() => {
    if (premium || !user) return;
    const flagKey = `freeLimit_${user.uid}_${new Date().getFullYear()}-${new Date().getMonth()}`;
    if (monthlyCount >= FREE_MONTHLY_TX_LIMIT && !localStorage.getItem(flagKey)) {
      toast.error(`🚫 Limite Free atingido (${FREE_MONTHLY_TX_LIMIT}/mês). Faça upgrade!`, { duration: 7000 });
      localStorage.setItem(flagKey, "1");
      setShowPremium(true);
    }
  }, [monthlyCount, premium, user]);

  const memberSince = useMemo(() => {
    if (user?.metadata.creationTime) return new Date(user.metadata.creationTime);
    return undefined;
  }, [user]);

  return (
    <main className={`max-w-md mx-auto px-4 pt-5 pb-24 relative z-10 animate-fade-in ${premium ? "premium-theme" : ""}`}>
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center glow-primary"
            style={{ background: premium ? "var(--gradient-btn-gold)" : "var(--gradient-primary)" }}>
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-display font-extrabold tracking-tight">
            Finanças
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {premium ? (
            <span className="font-mono text-[10px] px-2.5 py-1 rounded-full premium-crown-badge flex items-center gap-1">
              <Crown className="w-3 h-3" /> Premium
            </span>
          ) : (
            <button
              onClick={() => setShowPremium(true)}
              className="font-mono text-[10px] px-3 py-1.5 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition flex items-center gap-1"
            >
              <Crown className="w-3 h-3" /> Premium
            </button>
          )}
          {isAdmin(user) && (
            <Link to="/admin" className="w-8 h-8 rounded-full bg-secondary border border-gold/30 flex items-center justify-center text-gold">
              <Shield className="w-3.5 h-3.5" />
            </Link>
          )}
          <button onClick={() => logout()}
            className="w-8 h-8 rounded-full bg-secondary border border-white/10 flex items-center justify-center text-muted-foreground hover:text-destructive">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex border-b border-white/10 mb-5 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            data-active={tab === t.id}
            className="tab-btn"
          >
            <t.icon className="w-4 h-4" />
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      {/* Free plan strip (only shown when not premium and on Painel) */}
      {!premium && tab === "painel" && (
        <section className="surface-card !rounded-2xl px-4 py-3 mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              Plano Free • Uso do mês
            </p>
            <p className="font-mono text-[11px]">
              <span className={remaining <= 5 ? "text-destructive font-bold" : "text-foreground"}>
                {monthlyCount}
              </span>
              <span className="text-muted-foreground">/{FREE_MONTHLY_TX_LIMIT}</span>
            </p>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full transition-all"
              style={{
                width: `${Math.min(100, (monthlyCount / FREE_MONTHLY_TX_LIMIT) * 100)}%`,
                background: remaining <= 5 ? "hsl(var(--destructive))" : "var(--gradient-btn-primary)",
              }} />
          </div>
        </section>
      )}

      {/* Tab content */}
      <div key={tab} className="animate-fade-in">
        {tab === "painel" && <PainelTab txs={txs} premium={premium} onUpgrade={() => setShowPremium(true)} />}
        {tab === "transacoes" && user && (
          <TransacoesTab uid={user.uid} txs={txs} premium={premium} onUpgrade={() => setShowPremium(true)} />
        )}
        {tab === "orcamentos" && user && (
          <OrcamentosTab uid={user.uid} txs={txs} premium={premium} onUpgrade={() => setShowPremium(true)} />
        )}
        {tab === "metas" && user && (
          <MetasTab uid={user.uid} premium={premium} onUpgrade={() => setShowPremium(true)} />
        )}
        {tab === "relatorios" && (
          <RelatoriosTab txs={txs} premium={premium} onUpgrade={() => setShowPremium(true)} memberSince={memberSince} />
        )}
      </div>

      <PremiumModal open={showPremium} onClose={() => setShowPremium(false)} />
    </main>
  );
};

export default Dashboard;
