import { useState } from "react";
import { Bot, Sparkles, RefreshCw } from "lucide-react";
import { getAdvice, AdvisorTx } from "@/lib/aiAdvisor";

interface Props {
  txs: AdvisorTx[];
  premium: boolean;
  onUpgrade: () => void;
}

const AIAdvisor = ({ txs, premium, onUpgrade }: Props) => {
  const [tip, setTip] = useState<string>(() => getAdvice(txs));
  const [loading, setLoading] = useState(false);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setTip(getAdvice(txs));
      setLoading(false);
    }, 400);
  };

  if (!premium) {
    return (
      <button
        onClick={onUpgrade}
        className="surface-card w-full p-5 mb-4 text-left hover:border-gold/40 transition-colors group"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--gold) / 0.12)" }}>
            <Bot className="w-5 h-5 text-gold" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold flex items-center gap-1.5">IA Financeira <Sparkles className="w-3 h-3 text-gold" /></p>
            <p className="font-mono text-[10px] text-gold uppercase tracking-widest">Recurso Premium</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          🔒 Receba conselhos personalizados sobre seus gastos. Toque para desbloquear.
        </p>
      </button>
    );
  }

  return (
    <section className="surface-card p-5 mb-4 relative overflow-hidden">
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full" style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.12) 0%, transparent 70%)" }} />
      <div className="flex items-center justify-between mb-3 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: "var(--gradient-gold)" }}>
            <Bot className="w-4 h-4 text-background" />
          </div>
          <div>
            <p className="text-sm font-bold">IA Financeira</p>
            <p className="font-mono text-[9px] text-gold uppercase tracking-widest">Premium ativo</p>
          </div>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="w-8 h-8 rounded-lg bg-secondary border border-white/10 flex items-center justify-center hover:border-gold transition"
          aria-label="Nova dica"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
      <p className="text-sm leading-relaxed relative">{tip}</p>
    </section>
  );
};

export default AIAdvisor;
