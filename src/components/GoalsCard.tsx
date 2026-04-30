import { useEffect, useState } from "react";
import { Target, Crown, Check, Pencil } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatBRLInput, parseBRL } from "@/lib/format";
import { toast } from "sonner";

interface Props {
  uid: string;
  premium: boolean;
  monthlySaved: number; // current saved this month (income - expense)
  onUpgrade: () => void;
}

const storageKey = (uid: string) => `goal_monthly_${uid}`;

const fmtBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const GoalsCard = ({ uid, premium, monthlySaved, onUpgrade }: Props) => {
  const [goal, setGoal] = useState<number>(0);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(storageKey(uid));
    if (raw) setGoal(Number(raw) || 0);
  }, [uid]);

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
            <Target className="w-5 h-5 text-gold" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold flex items-center gap-1.5">
              Metas financeiras <Crown className="w-3 h-3 text-gold" />
            </p>
            <p className="font-mono text-[10px] text-gold uppercase tracking-widest">
              Recurso Premium
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          🔒 Defina uma meta mensal de economia e acompanhe seu progresso.
        </p>
      </button>
    );
  }

  const save = () => {
    const v = parseBRL(input);
    if (!v || v <= 0) return toast.error("Valor inválido");
    localStorage.setItem(storageKey(uid), String(v));
    setGoal(v);
    setEditing(false);
    setInput("");
    toast.success("Meta salva!");
  };

  const pct = goal > 0 ? Math.min(100, Math.max(0, (monthlySaved / goal) * 100)) : 0;
  const reached = monthlySaved >= goal && goal > 0;

  return (
    <section className="surface-card p-5 mb-4 relative overflow-hidden border-gold/20">
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full"
        style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.12) 0%, transparent 70%)" }}
      />
      <div className="flex items-center justify-between mb-3 relative">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center"
            style={{ background: "var(--gradient-btn-gold)" }}
          >
            <Target className="w-4 h-4 text-background" />
          </div>
          <div>
            <p className="text-sm font-bold">Meta do mês</p>
            <p className="font-mono text-[9px] text-gold uppercase tracking-widest">Premium</p>
          </div>
        </div>
        {goal > 0 && !editing && (
          <button
            onClick={() => {
              setInput(formatBRLInput(String(Math.round(goal * 100))));
              setEditing(true);
            }}
            className="w-8 h-8 rounded-lg bg-secondary border border-white/10 flex items-center justify-center hover:border-gold transition"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {goal === 0 || editing ? (
        <div className="space-y-2 relative">
          <p className="text-xs text-muted-foreground">
            Quanto você quer economizar este mês?
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              placeholder="R$ 500,00"
              value={input}
              onChange={(e) => setInput(formatBRLInput(e.target.value))}
              className="input-styled font-mono flex-1"
            />
            <button
              onClick={save}
              className="px-4 rounded-[10px] font-bold text-sm text-background"
              style={{ background: "var(--gradient-btn-gold)" }}
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative space-y-2">
          <div className="flex items-baseline justify-between">
            <p className={`text-2xl font-extrabold ${reached ? "text-gold" : "text-foreground"}`}>
              {fmtBRL(Math.max(0, monthlySaved))}
            </p>
            <p className="font-mono text-[11px] text-muted-foreground">
              de {fmtBRL(goal)}
            </p>
          </div>
          <Progress value={pct} className="h-2" />
          <p className="font-mono text-[10px] text-muted-foreground">
            {reached
              ? "🎉 Meta atingida! Parabéns."
              : `${pct.toFixed(0)}% concluído • faltam ${fmtBRL(goal - monthlySaved)}`}
          </p>
        </div>
      )}
    </section>
  );
};

export default GoalsCard;
