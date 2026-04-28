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
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [step, setStep] = useState<"info" | "payment">("info");

  if (!open) return null;

  const buildWhatsMessage = () => {
    const userName = name.trim() || user?.displayName || "(não informado)";
    const userEmail = user?.email ?? user?.uid ?? "(não informado)";
    return `Olá! Acabei de fazer o Pix de ${PIX_VALUE} para ativar o Premium no FinançasPro.\n\nMeu e-mail: ${userEmail}\nMeu nome: ${userName}\n\nSegue o comprovante em anexo.`;
  };

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
    } catch {
      // ignore — segue para o WhatsApp mesmo se as regras bloquearem
    } finally {
      setSending(false);
    }
    const url = `https://wa.me/55${WHATSAPP}?text=${encodeURIComponent(buildWhatsMessage())}`;
    window.open(url, "_blank");
    toast.success("Abrindo WhatsApp para enviar o comprovante…");
    onClose();
    setStep("info");
    setWhats("");
    setName("");
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

            {/* PASSO 1 */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-gold text-background font-bold text-xs flex items-center justify-center">1</span>
                <p className="text-sm font-bold">Faça o PIX de <span className="text-gold">{PIX_VALUE}</span></p>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground mb-2.5 ml-8">Use a chave abaixo no app do seu banco</p>

              <div className="space-y-2">
                <div className="surface-2 rounded-xl p-3 border border-gold/30">
                  <p className="font-mono text-[10px] text-gold uppercase tracking-widest mb-1">Chave PIX (e-mail)</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-mono truncate text-gold">{PIX_KEY}</p>
                    <button onClick={() => copy(PIX_KEY, "Chave PIX")} className="flex-shrink-0 w-9 h-9 rounded-lg bg-gold/20 border border-gold/40 flex items-center justify-center hover:bg-gold/30">
                      {copied === "Chave PIX" ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-gold" />}
                    </button>
                  </div>
                </div>
                <div className="surface-2 rounded-xl p-3">
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Recebedor</p>
                  <p className="text-sm font-semibold">{PIX_NAME}</p>
                </div>
              </div>
            </div>

            {/* PASSO 2 */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-gold text-background font-bold text-xs flex items-center justify-center">2</span>
                <p className="text-sm font-bold">Seus dados</p>
              </div>
              <div className="ml-8 space-y-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="input-styled"
                />
                <input
                  type="tel"
                  value={whats}
                  onChange={(e) => setWhats(e.target.value)}
                  placeholder="WhatsApp com DDD (ex: 11999999999)"
                  className="input-styled"
                />
              </div>
            </div>

            {/* PASSO 3 */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-gold text-background font-bold text-xs flex items-center justify-center">3</span>
                <p className="text-sm font-bold">Envie o comprovante</p>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground ml-8">
                Ao clicar abaixo, abriremos o WhatsApp com sua mensagem pronta. Basta anexar o comprovante e enviar — seu Premium é ativado em até 24h.
              </p>
            </div>

            <button
              onClick={submitRequest}
              disabled={sending}
              className="w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all hover:-translate-y-px disabled:opacity-50 text-background"
              style={{ background: "var(--gradient-btn-gold)" }}
            >
              {sending ? "Abrindo WhatsApp…" : "📱 Já fiz o PIX — Enviar comprovante"}
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
