import { useState } from "react";
import { Crown, Sparkles, X, Copy, Check, Bot, Target, Download, PieChart, Bell, Palette } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { requestPremium } from "@/lib/premium";

const PIX_KEY = "wildsonaguiar5@gmail.com";
const PIX_NAME = "WILDSON AGUIAR JÚNIOR";
const PIX_VALUE = "R$ 4,99";
const WHATSAPP = "98985724703";

interface Props {
  open: boolean;
  onClose: () => void;
}

const PremiumModal = ({ open, onClose }: Props) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState<string | null>(null);
  const [whats, setWhats] = useState("");
  const [sending, setSending] = useState(false);
  const [step, setStep] = useState<"info" | "payment">("info");

  if (!open) return null;

  const copy = async (text: string, label: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-secure contexts
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(label);
      toast.success(`${label} copiado!`);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("Não foi possível copiar. Selecione manualmente.");
    }
  };

  const submitRequest = async () => {
    if (!user) return;
    const clean = whats.replace(/\D/g, "");
    if (clean.length < 10) return toast.error("Informe um WhatsApp válido");
    setSending(true);
    try {
      await requestPremium(user.uid, user.email, clean);
      toast.success("Solicitação enviada! Aguarde a confirmação.");
      onClose();
      setStep("info");
      setWhats("");
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao enviar");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-3" onClick={onClose}>
      <div
        className="surface-card w-full max-w-md max-h-[92vh] overflow-y-auto p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary border border-white/10 flex items-center justify-center hover:border-white/20"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {step === "info" ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "var(--gradient-btn-gold)" }}>
                <Crown className="w-6 h-6 text-background" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-gold">Premium</h2>
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Acesso completo</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-5">
              Desbloqueie todo o potencial do <span className="text-foreground font-semibold">Finanças Pro</span>:
            </p>

            <ul className="space-y-2.5 mb-6">
              {[
                { icon: Bot, t: "IA Financeira", d: "Conselhos personalizados sobre seus gastos" },
                { icon: Target, t: "Metas ilimitadas", d: "Defina e acompanhe objetivos financeiros" },
                { icon: PieChart, t: "Relatórios avançados", d: "Gráficos detalhados e análises mensais" },
                { icon: Download, t: "Exportar dados", d: "Baixe extratos em PDF e CSV" },
                { icon: Bell, t: "Alertas inteligentes", d: "Notificações de gastos excessivos" },
                { icon: Palette, t: "Temas exclusivos", d: "Personalize o visual do seu app" },
                { icon: Sparkles, t: "Categorias ilimitadas", d: "Crie quantas categorias quiser" },
              ].map((f) => (
                <li key={f.t} className="flex items-start gap-3 p-3 surface-2 rounded-xl">
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: "hsl(var(--gold) / 0.12)" }}>
                    <f.icon className="w-4 h-4 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{f.t}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{f.d}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex items-baseline gap-2 mb-5 justify-center">
              <span className="text-4xl font-extrabold text-gold tracking-tighter">{PIX_VALUE}</span>
              <span className="font-mono text-xs text-muted-foreground">/ acesso vitalício</span>
            </div>

            <button
              onClick={() => setStep("payment")}
              className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all hover:-translate-y-px text-background"
              style={{ background: "var(--gradient-btn-gold)" }}
            >
              Ativar Premium
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "var(--gradient-btn-gold)" }}>
                <Crown className="w-6 h-6 text-background" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-gold">Pagamento PIX</h2>
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Valor: {PIX_VALUE}</p>
              </div>
            </div>

            <ol className="space-y-2 mb-5 text-sm">
              <li className="flex gap-2"><span className="text-gold font-bold">1.</span> Faça o PIX de <span className="text-gold font-bold">{PIX_VALUE}</span> com a chave abaixo</li>
              <li className="flex gap-2"><span className="text-gold font-bold">2.</span> Informe seu WhatsApp</li>
              <li className="flex gap-2"><span className="text-gold font-bold">3.</span> Envie o comprovante para confirmação</li>
            </ol>

            <div className="space-y-2.5 mb-5">
              <div className="surface-2 rounded-xl p-3.5">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Nome no PIX</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold truncate">{PIX_NAME}</p>
                  <button onClick={() => copy(PIX_NAME, "Nome")} className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary border border-white/10 flex items-center justify-center hover:border-gold">
                    {copied === "Nome" ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="surface-2 rounded-xl p-3.5 border border-gold/30">
                <p className="font-mono text-[10px] text-gold uppercase tracking-widest mb-1">Chave PIX (e-mail)</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-mono truncate text-gold">{PIX_KEY}</p>
                  <button onClick={() => copy(PIX_KEY, "Chave PIX")} className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary border border-gold/40 flex items-center justify-center hover:bg-gold/10">
                    {copied === "Chave PIX" ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-gold" />}
                  </button>
                </div>
              </div>

              <div className="surface-2 rounded-xl p-3.5">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">WhatsApp para confirmação</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-mono">{WHATSAPP}</p>
                  <button onClick={() => copy(WHATSAPP, "WhatsApp")} className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary border border-white/10 flex items-center justify-center hover:border-gold">
                    {copied === "WhatsApp" ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block">
                Seu WhatsApp (com DDD)
              </label>
              <input
                type="tel"
                value={whats}
                onChange={(e) => setWhats(e.target.value)}
                placeholder="11999999999"
                className="input-styled"
              />
              <p className="font-mono text-[10px] text-muted-foreground mt-1.5">
                Vamos te confirmar a ativação por aqui assim que o pagamento for verificado.
              </p>
            </div>

            <a
              href={`https://wa.me/55${WHATSAPP}?text=${encodeURIComponent(`Olá! Acabei de fazer o PIX de ${PIX_VALUE} para ativar o Premium do Finanças Pro. Email da minha conta: ${user?.email ?? user?.uid}`)}`}
              target="_blank"
              rel="noreferrer"
              className="block w-full py-3 rounded-xl font-bold text-sm text-center bg-secondary border border-white/10 mb-2 hover:border-white/20 transition"
            >
              📱 Enviar comprovante no WhatsApp
            </a>

            <button
              onClick={submitRequest}
              disabled={sending}
              className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all hover:-translate-y-px disabled:opacity-50 text-background"
              style={{ background: "var(--gradient-btn-gold)" }}
            >
              {sending ? "Enviando…" : "Já fiz o PIX — Confirmar"}
            </button>

            <button
              onClick={() => setStep("info")}
              className="w-full py-2.5 mt-2 text-xs text-muted-foreground hover:text-foreground transition"
            >
              ← Voltar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PremiumModal;
