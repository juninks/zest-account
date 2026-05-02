import { useEffect, useState } from "react";
import { Plus, Crown, Target, Check, X } from "lucide-react";
import { toast } from "sonner";
import {
  Goal,
  GOAL_CATEGORIES,
  GoalCategory,
  addGoal,
  addToGoal,
  deleteGoal,
  getGoals,
  getCategoryMeta,
} from "@/lib/goals";
import { formatBRLInput, parseBRL } from "@/lib/format";

interface Props {
  uid: string;
  premium: boolean;
  onUpgrade: () => void;
}

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Manual deposit input per goal

const MetasTab = ({ uid, premium, onUpgrade }: Props) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [deposits, setDeposits] = useState<Record<string, string>>({});

  // form
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [category, setCategory] = useState<GoalCategory>("reserva");

  const reload = () => setGoals(getGoals(uid));
  useEffect(() => { if (premium) reload(); }, [uid, premium]);

  if (!premium) {
    return (
      <button
        onClick={onUpgrade}
        className="surface-card w-full p-8 text-left hover:border-gold/40 transition-colors"
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "hsl(var(--gold) / 0.12)" }}>
          <Target className="w-7 h-7 text-gold" />
        </div>
        <h2 className="text-xl font-extrabold mb-2 flex items-center gap-2">
          Metas financeiras <Crown className="w-4 h-4 text-gold" />
        </h2>
        <p className="font-mono text-[10px] text-gold uppercase tracking-widest mb-3">Recurso Premium</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          🔒 Crie quantas metas quiser, organize por categoria (viagem, reserva, casa…) e acompanhe o progresso.
        </p>
      </button>
    );
  }

  const submit = () => {
    const t = parseBRL(target);
    if (!name.trim()) return toast.error("Dê um nome para sua meta");
    if (t <= 0) return toast.error("Valor alvo inválido");
    addGoal(uid, { name: name.trim(), target: t, category });
    setName(""); setTarget(""); setCategory("reserva"); setShowForm(false);
    reload();
    toast.success("Meta criada!");
  };

  const depositManual = (id: string) => {
    const v = parseBRL(deposits[id] ?? "");
    if (!v || v <= 0) return toast.error("Digite um valor válido");
    addToGoal(uid, id, v);
    setDeposits((d) => ({ ...d, [id]: "" }));
    reload();
    toast.success(`+${fmt(v)} guardado!`);
  };

  const remove = (id: string) => {
    deleteGoal(uid, id);
    reload();
    toast.success("Meta removida");
  };

  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const completed = goals.filter((g) => g.saved >= g.target).length;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Metas</h1>
          <p className="text-xs text-muted-foreground">
            Ilimitadas · Premium <span className="text-gold">👑</span>
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="px-4 py-2.5 rounded-xl font-bold text-sm bg-foreground text-background hover:opacity-90 transition flex items-center gap-1.5"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancelar" : "Nova"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="surface-card p-3 border border-accent/20">
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Total</p>
          <p className="text-lg font-extrabold flex items-center gap-1">🎯 <span className="text-accent">{goals.length}</span></p>
        </div>
        <div className="surface-card p-3 border border-primary/20">
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Concluídas</p>
          <p className="text-lg font-extrabold flex items-center gap-1">✅ <span className="text-primary">{completed}</span></p>
        </div>
        <div className="surface-card p-3 border border-gold/20">
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Poupado</p>
          <p className="text-sm font-extrabold flex items-center gap-1">💰 <span className="text-gold truncate">{fmt(totalSaved)}</span></p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="surface-card p-5 space-y-3 animate-slide-in border-primary/30">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block">
              Nome da meta
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Viagem pro Japão"
              className="input-styled"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block">
              Valor alvo
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={target}
              onChange={(e) => setTarget(formatBRLInput(e.target.value))}
              placeholder="R$ 0,00"
              className="input-styled font-mono"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block">
              Categoria
            </label>
            <div className="grid grid-cols-4 gap-2">
              {GOAL_CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className={`py-2.5 rounded-xl text-[11px] font-bold border transition ${
                    category === c.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-white/10 bg-secondary text-muted-foreground"
                  }`}
                >
                  <div className="text-base">{c.emoji}</div>
                  <div>{c.label}</div>
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={submit}
            className="w-full py-3 rounded-xl font-bold text-sm text-primary-foreground"
            style={{ background: "var(--gradient-btn-primary)" }}
          >
            <Check className="w-4 h-4 inline mr-1" /> Criar meta
          </button>
        </div>
      )}

      {/* Goals list */}
      {goals.length === 0 && !showForm ? (
        <div className="surface-card p-10 text-center">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-sm text-muted-foreground mb-3">Você ainda não tem metas.</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-sm text-primary font-bold underline"
          >
            Criar primeira meta
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((g) => {
            const pct = g.target > 0 ? Math.min(100, (g.saved / g.target) * 100) : 0;
            const reached = g.saved >= g.target;
            const meta = getCategoryMeta(g.category);
            return (
              <div key={g.id} className="surface-card p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: "hsl(var(--gold) / 0.12)" }}>
                    {meta.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{g.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {fmt(g.saved)} de {fmt(g.target)} · faltam {fmt(Math.max(0, g.target - g.saved))}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-extrabold ${reached ? "text-primary" : "text-accent"}`}>
                      {pct.toFixed(0)}%
                    </p>
                    <button
                      onClick={() => remove(g.id)}
                      className="font-mono text-[9px] text-muted-foreground hover:text-destructive transition"
                    >
                      remover
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: reached
                        ? "var(--gradient-btn-primary)"
                        : "linear-gradient(90deg, hsl(var(--accent)), hsl(280 80% 65%))",
                    }}
                  />
                </div>

                {/* Manual deposit input */}
                {!reached && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={deposits[g.id] ?? ""}
                      onChange={(e) =>
                        setDeposits((d) => ({ ...d, [g.id]: formatBRLInput(e.target.value) }))
                      }
                      placeholder="Quanto você guardou?"
                      className="input-styled font-mono text-sm flex-1"
                    />
                    <button
                      onClick={() => depositManual(g.id)}
                      className="px-4 rounded-xl text-sm font-bold text-primary-foreground"
                      style={{ background: "var(--gradient-btn-primary)" }}
                    >
                      Guardar
                    </button>
                  </div>
                )}
                {reached && (
                  <p className="text-center text-primary font-bold text-sm py-1">🎉 Meta atingida!</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MetasTab;
