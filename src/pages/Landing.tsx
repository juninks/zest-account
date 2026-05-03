import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowUpRight, ArrowRight } from "lucide-react";

const Landing = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="font-mono text-[10px] text-muted-foreground tracking-[0.3em] uppercase animate-pulse">
          carregando
        </div>
      </div>
    );
  }
  if (user) return <Navigate to="/app" replace />;

  return (
    <main className="relative z-10 min-h-screen">
      {/* ===== TOP BAR ===== */}
      <header className="max-w-6xl mx-auto px-6 pt-7 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
          <span
            className="text-[15px] tracking-tight"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
          >
            Finanças<span className="italic text-primary"> Pro</span>
          </span>
        </div>
        <nav className="flex items-center gap-1.5">
          <Link
            to="/login?mode=login"
            className="px-4 py-2 rounded-full text-xs font-medium hover:bg-white/5 transition"
          >
            Entrar
          </Link>
          <Link
            to="/login?mode=signup"
            className="px-4 py-2 rounded-full text-xs font-bold bg-foreground text-background hover:opacity-90 transition flex items-center gap-1"
          >
            Criar conta <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </nav>
      </header>

      {/* ===== HERO ===== */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        {/* meta line */}
        <div className="flex items-center gap-3 mb-8">
          <span className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground uppercase">
            01 — Visão geral
          </span>
          <div className="flex-1 h-px bg-white/10" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
            v.2026
          </span>
        </div>

        {/* Big editorial headline */}
        <h1
          className="leading-[0.92] tracking-[-0.04em] mb-8"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          <span className="block text-[clamp(3rem,11vw,7.5rem)] font-medium">
            Dinheiro
          </span>
          <span
            className="block text-[clamp(3rem,11vw,7.5rem)] italic text-primary -mt-2"
            style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
          >
            sem ruído.
          </span>
          <span className="block text-[clamp(3rem,11vw,7.5rem)] font-medium -mt-2">
            Só clareza.
          </span>
        </h1>

        {/* Two-column subhead */}
        <div className="grid sm:grid-cols-12 gap-6 max-w-4xl mb-12">
          <p className="sm:col-span-7 text-[17px] leading-[1.55] text-muted-foreground">
            Um caderno financeiro feito pra quem cansou de planilhas confusas e
            apps que enchem a tela de gráfico inútil. Aqui você anota,
            categoriza e entende — em segundos.
          </p>
          <div className="sm:col-span-5 sm:border-l sm:border-white/10 sm:pl-6 flex flex-col justify-end">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
              Pra quem
            </p>
            <p className="text-sm leading-relaxed">
              Pessoas que querem <em className="text-foreground italic">pensar menos</em> em
              dinheiro pra gastar a cabeça com coisas melhores.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/login?mode=signup"
            className="group inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-foreground text-background hover:opacity-90 transition"
          >
            <span className="text-sm font-bold">Começar agora</span>
            <span className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:rotate-45 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </Link>
          <Link
            to="/login?mode=login"
            className="text-sm underline underline-offset-4 decoration-white/20 hover:decoration-foreground transition"
          >
            Já tenho conta
          </Link>
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground ml-auto">
            grátis · sem cartão
          </span>
        </div>
      </section>

      {/* ===== STATS — editorial style ===== */}
      <section className="border-y border-white/10 bg-card/30">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-3 gap-6">
          {[
            { n: "50", u: "/mês", l: "transações no plano free" },
            { n: "0", u: "$", l: "pra começar a usar hoje" },
            { n: "100", u: "%", l: "seus dados, criptografados" },
          ].map((s, i) => (
            <div
              key={i}
              className={i < 2 ? "border-r border-white/10 pr-6" : ""}
            >
              <p
                className="leading-none mb-2"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                <span className="text-[clamp(2rem,7vw,4rem)] font-medium">
                  {s.n}
                </span>
                <span className="text-[clamp(1rem,3vw,1.5rem)] italic text-muted-foreground">
                  {s.u}
                </span>
              </p>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES — text-led, no bloated cards ===== */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex items-baseline gap-3 mb-12">
          <span className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground uppercase">
            02 — O essencial
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <h2
          className="text-[clamp(2rem,6vw,3.75rem)] leading-[0.95] tracking-[-0.03em] mb-16 max-w-3xl"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
        >
          Tudo que importa.{" "}
          <span
            className="italic text-muted-foreground"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Nada que não.
          </span>
        </h2>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-14">
          {[
            {
              n: "I",
              t: "Lançamentos rápidos",
              d: "Adicione receita ou despesa em três toques. Sem formulários quilométricos, sem categorias forçadas.",
            },
            {
              n: "II",
              t: "Metas que importam",
              d: "Crie quantas quiser — viagem, reserva, troca de carro. Acompanhe o progresso sem se afogar em telas.",
            },
            {
              n: "III",
              t: "Análise por IA",
              d: "Uma leitura honesta do seu mês. Onde sobrou, onde escapou, e o que dá pra fazer diferente.",
            },
            {
              n: "IV",
              t: "Categorias suas",
              d: "Crie, renomeie, apague. O app se adapta a como você gasta — não o contrário.",
            },
          ].map((f) => (
            <div key={f.n} className="flex gap-5">
              <span
                className="font-mono text-[11px] tracking-[0.2em] text-primary pt-1 shrink-0"
                style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic" }}
              >
                {f.n}.
              </span>
              <div>
                <h3
                  className="text-2xl mb-2 tracking-tight"
                  style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
                >
                  {f.t}
                </h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  {f.d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== QUOTE / MANIFESTO ===== */}
      <section className="border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <p
            className="text-[clamp(1.75rem,5vw,3rem)] leading-[1.15] tracking-[-0.02em]"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}
          >
            <span className="italic text-primary" style={{ fontFamily: "'Instrument Serif', serif" }}>
              “
            </span>
            A maioria dos apps de finanças tenta te impressionar.{" "}
            <span
              className="italic"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Esse aqui só quer te ajudar a entender pra onde foi o dinheiro
              do mês.
            </span>
            <span className="italic text-primary" style={{ fontFamily: "'Instrument Serif', serif" }}>
              ”
            </span>
          </p>
          <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground mt-8">
            — A gente, fazendo o app
          </p>
        </div>
      </section>

      {/* ===== PLANS ===== */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex items-baseline gap-3 mb-12">
          <span className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground uppercase">
            03 — Planos
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-white/10 rounded-2xl overflow-hidden">
          {/* Free */}
          <div className="bg-background p-8 sm:p-10">
            <div className="flex items-baseline justify-between mb-1">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                Free
              </p>
              <p
                className="text-3xl"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
              >
                R$ 0
              </p>
            </div>
            <p className="text-xs text-muted-foreground mb-6">pra sempre</p>
            <ul className="space-y-3 text-sm">
              {[
                "50 transações por mês",
                "Categorias básicas",
                "Resumo mensal",
              ].map((x) => (
                <li key={x} className="flex items-start gap-3">
                  <span className="text-primary mt-1">—</span>
                  <span>{x}</span>
                </li>
              ))}
              {["IA financeira", "Metas e gráficos", "Categorias custom"].map(
                (x) => (
                  <li
                    key={x}
                    className="flex items-start gap-3 text-muted-foreground/60 line-through"
                  >
                    <span className="mt-1">—</span>
                    <span>{x}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Premium */}
          <div className="bg-background p-8 sm:p-10 relative">
            <div className="flex items-baseline justify-between mb-1">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold">
                Premium
              </p>
              <p
                className="text-3xl text-gold italic"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                vitalício
              </p>
            </div>
            <p className="text-xs text-muted-foreground mb-6">
              pague uma vez, use pra sempre
            </p>
            <ul className="space-y-3 text-sm">
              {[
                "Transações ilimitadas",
                "IA financeira completa",
                "Metas mensais com progresso",
                "Gráficos por categoria",
                "Categorias personalizadas",
                "Tema dourado exclusivo",
              ].map((x) => (
                <li key={x} className="flex items-start gap-3">
                  <span className="text-gold mt-1">—</span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
              04 — Hora de começar
            </span>
            <h2
              className="mt-4 text-[clamp(2.25rem,7vw,4.5rem)] leading-[0.95] tracking-[-0.03em]"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
            >
              Cinco minutos.{" "}
              <span
                className="italic text-primary"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Um mês inteiro
              </span>{" "}
              de clareza.
            </h2>
          </div>
          <div className="md:col-span-4 flex md:justify-end">
            <Link
              to="/login?mode=signup"
              className="group inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              <span className="text-sm font-bold">Criar minha conta</span>
              <span className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            © {new Date().getFullYear()} Finanças Pro
          </p>
          <p
            className="text-xs italic text-muted-foreground"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Feito com calma, no Brasil.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Landing;
