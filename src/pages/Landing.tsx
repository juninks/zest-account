import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Wallet,
  ArrowRight,
  Sparkles,
  Bot,
  Target,
  PieChart,
  Crown,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";

const Feature = ({
  icon: Icon,
  title,
  desc,
  accent = "primary",
}: {
  icon: any;
  title: string;
  desc: string;
  accent?: "primary" | "gold" | "accent";
}) => {
  const bg =
    accent === "gold"
      ? "hsl(var(--gold) / 0.12)"
      : accent === "accent"
      ? "hsl(var(--accent) / 0.12)"
      : "hsl(var(--primary) / 0.12)";
  const fg =
    accent === "gold" ? "text-gold" : accent === "accent" ? "text-accent" : "text-primary";
  return (
    <div className="surface-card p-5 hover:-translate-y-0.5 transition-transform">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
        style={{ background: bg }}
      >
        <Icon className={`w-5 h-5 ${fg}`} />
      </div>
      <h3 className="text-base font-extrabold tracking-tight mb-1">{title}</h3>
      <p className="text-[13px] text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
};

const Landing = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="font-mono text-xs text-muted-foreground tracking-widest uppercase animate-pulse">
          Carregando…
        </div>
      </div>
    );
  }

  // Already logged in → go straight to app
  if (user) return <Navigate to="/app" replace />;

  return (
    <main className="max-w-5xl mx-auto px-5 pt-6 pb-16 relative z-10 animate-fade-in">
      {/* Top bar */}
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center glow-primary"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            Finanças <span className="text-primary">Pro</span>
          </span>
        </div>
        <Link
          to="/login?mode=login"
          className="font-mono text-[11px] uppercase tracking-widest px-4 py-2 rounded-full border border-white/10 hover:border-primary/50 transition"
        >
          Entrar
        </Link>
      </header>

      {/* Hero */}
      <section className="text-center mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
            Novo • Com IA financeira
          </span>
        </div>

        <h1
          className="tracking-tight leading-[0.95] mb-5 text-[clamp(2.75rem,11vw,5.5rem)]"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
        >
          Suas finanças,<br />
          <span
            className="italic gradient-text-blue block mt-1 text-[clamp(2.5rem,10vw,5rem)]"
            style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
          >
            organizadas<br />de verdade.
          </span>
        </h1>

        <p className="text-base text-muted-foreground max-w-xl mx-auto mb-7 leading-relaxed">
          Controle receitas, despesas, metas e categorias num só lugar.
          Bonito, rápido e com inteligência artificial pra te ajudar a economizar.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            to="/login?mode=signup"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-primary-foreground transition-all hover:-translate-y-px"
            style={{ background: "var(--gradient-btn-primary)", boxShadow: "var(--shadow-card)" }}
          >
            Começar grátis <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login?mode=login"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-secondary border border-white/10 hover:border-primary/40 transition"
          >
            Já tenho conta
          </Link>
        </div>

        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mt-5">
          Sem cartão • Plano Free disponível
        </p>
      </section>

      {/* Stats strip */}
      <section className="grid grid-cols-3 gap-3 mb-14 max-w-2xl mx-auto">
        {[
          { v: "50/mês", l: "Transações grátis" },
          { v: "100%", l: "Privado e seguro" },
          { v: "0$", l: "Pra começar" },
        ].map((s) => (
          <div key={s.l} className="surface-card p-4 text-center">
            <p className="text-xl font-extrabold gradient-text">{s.v}</p>
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-1">
              {s.l}
            </p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="mb-14">
        <div className="text-center mb-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">
            O que você consegue fazer
          </p>
          <h2
            className="font-extrabold tracking-tight text-[clamp(1.5rem,5.5vw,2rem)] leading-tight"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Tudo que você precisa pra dominar seu dinheiro
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Feature
            icon={TrendingUp}
            title="Receitas e despesas"
            desc="Adicione transações em segundos. Veja saldo, totais e top categoria automaticamente."
          />
          <Feature
            icon={PieChart}
            title="Gráficos por categoria"
            desc="Descubra pra onde seu dinheiro vai com gráficos visuais e percentuais claros."
            accent="accent"
          />
          <Feature
            icon={Bot}
            title="IA financeira"
            desc="Receba dicas personalizadas baseadas nos seus gastos reais."
            accent="gold"
          />
          <Feature
            icon={Target}
            title="Metas mensais"
            desc="Defina quanto quer economizar no mês e acompanhe seu progresso."
            accent="gold"
          />
          <Feature
            icon={Zap}
            title="Categorias personalizadas"
            desc="Crie categorias do seu jeito. Sem limites, sem amarras."
            accent="gold"
          />
          <Feature
            icon={ShieldCheck}
            title="Seus dados, seus"
            desc="Login seguro, dados criptografados. Você controla tudo."
          />
        </div>
      </section>

      {/* Plans */}
      <section className="mb-14">
        <div className="text-center mb-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">
            Planos
          </p>
          <h2
            className="font-extrabold tracking-tight text-[clamp(1.5rem,5.5vw,2rem)] leading-tight"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Comece grátis. Vire Premium quando quiser.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {/* Free */}
          <div className="surface-card p-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
              Plano Free
            </p>
            <p className="text-3xl font-extrabold mb-1">R$ 0</p>
            <p className="text-xs text-muted-foreground mb-5">Pra sempre</p>
            <ul className="space-y-2 text-sm">
              <li>✓ Até 50 transações por mês</li>
              <li>✓ Categorias básicas</li>
              <li>✓ Saldo e resumo do mês</li>
              <li className="text-muted-foreground">✗ IA financeira</li>
              <li className="text-muted-foreground">✗ Metas e gráficos</li>
              <li className="text-muted-foreground">✗ Categorias custom</li>
            </ul>
          </div>

          {/* Premium */}
          <div
            className="surface-card p-6 relative overflow-hidden"
            style={{ borderColor: "hsl(var(--gold) / 0.4)" }}
          >
            <div
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(var(--gold) / 0.15) 0%, transparent 70%)",
              }}
            />
            <div className="flex items-center gap-2 mb-2 relative">
              <Crown className="w-4 h-4 text-gold" />
              <p className="font-mono text-[10px] uppercase tracking-widest text-gold">
                Premium
              </p>
            </div>
            <p className="text-3xl font-extrabold mb-1 relative">
              <span className="text-gold">Vitalício</span>
            </p>
            <p className="text-xs text-muted-foreground mb-5 relative">
              Pague uma vez, use pra sempre
            </p>
            <ul className="space-y-2 text-sm relative">
              <li>✓ Transações <strong>ilimitadas</strong></li>
              <li>✓ IA financeira completa</li>
              <li>✓ Metas mensais com progresso</li>
              <li>✓ Gráficos por categoria</li>
              <li>✓ Categorias personalizadas</li>
              <li>✓ Tema dourado exclusivo</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center surface-card p-8 sm:p-10 relative overflow-hidden">
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
          }}
        />
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 relative">
          Pronto pra organizar tudo?
        </h2>
        <p className="text-sm text-muted-foreground mb-6 relative">
          Crie sua conta agora — leva menos de 30 segundos.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-primary-foreground transition-all hover:-translate-y-px relative"
          style={{ background: "var(--gradient-btn-primary)", boxShadow: "var(--shadow-card)" }}
        >
          Criar minha conta grátis <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <footer className="text-center mt-10 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
        © {new Date().getFullYear()} Finanças Pro
      </footer>
    </main>
  );
};

export default Landing;
