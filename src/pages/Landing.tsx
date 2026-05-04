import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  Tag,
  Sparkles,
  Plus as PlusIcon,
  ChevronDown,
} from "lucide-react";

const Landing = () => {
  const { user, loading } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const steps = [
    {
      n: "01",
      icon: Plus,
      t: "Anote",
      d: "Lance receita ou despesa em três toques. Valor, descrição, pronto.",
    },
    {
      n: "02",
      icon: Tag,
      t: "Categorize",
      d: "Escolha de uma lista — ou crie a sua. O app aprende como você gasta.",
    },
    {
      n: "03",
      icon: Sparkles,
      t: "Entenda",
      d: "A IA lê o seu mês e te diz, sem rodeio, onde sobrou e onde escapou.",
    },
  ];

  const testimonials = [
    {
      q: "Era o décimo app que tentava. Foi o primeiro que eu ainda uso depois de três meses.",
      a: "Marina C.",
      r: "designer, SP",
    },
    {
      q: "Sem gráfico inútil, sem notificação chata. Abro, anoto, fecho. Perfeito.",
      a: "Diego R.",
      r: "dev, POA",
    },
    {
      q: "A análise da IA me mostrou que eu gastava 600 reais em delivery. Eu não fazia ideia.",
      a: "Camila T.",
      r: "médica, BH",
    },
  ];

  const faqs = [
    {
      q: "É grátis mesmo?",
      a: "Sim. O plano free tem 50 transações por mês, pra sempre, sem cartão de crédito.",
    },
    {
      q: "Meus dados ficam seguros?",
      a: "Tudo criptografado e vinculado só à sua conta. Ninguém — nem a gente — vê seus lançamentos.",
    },
    {
      q: "Funciona no celular?",
      a: "Sim. Foi desenhado primeiro pra celular. Abre no navegador e pode salvar como app.",
    },
    {
      q: "Como é o Premium?",
      a: "Pagamento único, vitalício. Libera transações ilimitadas, IA completa, metas, gráficos e tema dourado.",
    },
    {
      q: "Posso cancelar?",
      a: "O free não tem o que cancelar. O Premium é único — não há cobrança recorrente.",
    },
  ];

  return (
    <main className="relative z-10 min-h-screen">
      {/* ===== TOP BAR ===== */}
      <header className="max-w-6xl mx-auto px-5 sm:px-6 pt-6 sm:pt-7 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
          <span className="font-display text-[15px] tracking-tight font-medium">
            Finanças<span className="italic text-primary font-serif-display"> Pro</span>
          </span>
        </div>
        <nav className="flex items-center gap-1.5">
          <Link
            to="/login?mode=login"
            className="px-3.5 sm:px-4 py-2 rounded-full text-xs font-medium hover:bg-white/5 transition"
          >
            Entrar
          </Link>
          <Link
            to="/login?mode=signup"
            className="px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold bg-foreground text-background hover:opacity-90 transition flex items-center gap-1"
          >
            Criar conta <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </nav>
      </header>

      {/* ===== HERO ===== */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-24">
        <div className="flex items-center gap-3 mb-7 sm:mb-8">
          <span className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground uppercase">
            01 — Visão geral
          </span>
          <div className="flex-1 h-px bg-white/10" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
            v.2026
          </span>
        </div>

        <h1 className="font-display leading-[0.95] tracking-[-0.04em] mb-7 sm:mb-8">
          <span className="block text-[clamp(2.75rem,11vw,7.5rem)] font-medium">
            Dinheiro
          </span>
          <span className="block text-[clamp(2.75rem,11vw,7.5rem)] italic text-primary font-serif-display -mt-1 sm:-mt-2 font-normal">
            sem ruído.
          </span>
          <span className="block text-[clamp(2.75rem,11vw,7.5rem)] font-medium -mt-1 sm:-mt-2">
            Só clareza.
          </span>
        </h1>

        <div className="grid sm:grid-cols-12 gap-6 max-w-4xl mb-10 sm:mb-12">
          <p className="sm:col-span-7 text-[16px] sm:text-[17px] leading-[1.55] text-muted-foreground">
            Um caderno financeiro feito pra quem cansou de planilhas confusas e
            apps que enchem a tela de gráfico inútil. Aqui você anota,
            categoriza e entende — em segundos.
          </p>
          <div className="sm:col-span-5 sm:border-l sm:border-white/10 sm:pl-6 flex flex-col justify-end">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
              Pra quem
            </p>
            <p className="text-sm leading-relaxed">
              Pessoas que querem{" "}
              <em className="text-foreground italic font-serif-display">
                pensar menos
              </em>{" "}
              em dinheiro pra gastar a cabeça com coisas melhores.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/login?mode=signup"
            className="group inline-flex items-center gap-3 pl-5 sm:pl-6 pr-2 py-2 rounded-full bg-foreground text-background hover:opacity-90 transition"
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
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground sm:ml-auto">
            grátis · sem cartão
          </span>
        </div>
      </section>

      {/* ===== TOUR (3 passos + preview do app) ===== */}
      <section className="border-y border-white/10 bg-card/30">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16 sm:py-24">
          <div className="flex items-baseline gap-3 mb-10 sm:mb-12">
            <span className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground uppercase">
              02 — Como funciona
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <h2 className="font-display text-[clamp(2rem,6vw,3.75rem)] leading-[0.95] tracking-[-0.03em] mb-12 sm:mb-16 max-w-3xl font-medium">
            Três passos.{" "}
            <span className="italic text-muted-foreground font-serif-display font-normal">
              Nenhuma curva.
            </span>
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Passos */}
            <ol className="space-y-8">
              {steps.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.n} className="flex gap-5 group">
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center bg-background group-hover:border-primary/60 transition">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground mt-2">
                        {s.n}
                      </span>
                    </div>
                    <div className="pt-1.5">
                      <h3 className="font-display text-2xl sm:text-3xl mb-1.5 tracking-tight font-medium">
                        {s.t}
                      </h3>
                      <p className="text-[15px] leading-relaxed text-muted-foreground max-w-md">
                        {s.d}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* Preview do app — mockup */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-[32px] blur-2xl" />
              <div className="relative surface-card p-5 sm:p-6 shadow-2xl">
                {/* status bar mock */}
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                    Painel · Outubro
                  </span>
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                </div>

                {/* saldo */}
                <div className="balance-bg rounded-2xl p-5 mb-4 border border-primary/20">
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1">
                    Saldo do mês
                  </p>
                  <p className="font-display text-4xl sm:text-5xl font-medium tracking-tight">
                    R$ 2.847
                    <span className="text-xl text-muted-foreground">,30</span>
                  </p>
                  <div className="flex gap-4 mt-3 text-xs">
                    <span className="text-primary">↑ R$ 5.200 entrou</span>
                    <span className="text-muted-foreground">
                      ↓ R$ 2.352 saiu
                    </span>
                  </div>
                </div>

                {/* lista de transações */}
                <div className="space-y-2.5">
                  {[
                    { d: "Mercado", c: "Alimentação", v: "-148,90" },
                    { d: "Salário", c: "Trabalho", v: "+5.200,00", p: true },
                    { d: "Uber", c: "Transporte", v: "-32,40" },
                  ].map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-secondary/40 border border-white/5"
                    >
                      <div>
                        <p className="text-sm font-medium">{t.d}</p>
                        <p className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground">
                          {t.c}
                        </p>
                      </div>
                      <span
                        className={`font-mono text-sm font-semibold ${
                          t.p ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {t.v}
                      </span>
                    </div>
                  ))}
                </div>

                {/* IA hint */}
                <div className="mt-4 p-3 rounded-lg border border-primary/20 bg-primary/5 flex gap-2.5 items-start">
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
                      IA ·{" "}
                    </span>
                    Você gastou 23% menos com delivery esse mês. Continua assim.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10 sm:py-12 grid grid-cols-3 gap-4 sm:gap-6">
          {[
            { n: "12k", u: "+", l: "pessoas usando" },
            { n: "4.9", u: "/5", l: "satisfação média" },
            { n: "100", u: "%", l: "dados criptografados" },
          ].map((s, i) => (
            <div
              key={i}
              className={i < 2 ? "border-r border-white/10 pr-4 sm:pr-6" : ""}
            >
              <p className="font-display leading-none mb-2">
                <span className="text-[clamp(1.75rem,7vw,4rem)] font-medium">
                  {s.n}
                </span>
                <span className="text-[clamp(0.875rem,3vw,1.5rem)] italic text-muted-foreground font-serif-display">
                  {s.u}
                </span>
              </p>
              <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-muted-foreground">
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS — editorial ===== */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 py-16 sm:py-24">
        <div className="flex items-baseline gap-3 mb-10 sm:mb-12">
          <span className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground uppercase">
            03 — Quem já usa
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <h2 className="font-display text-[clamp(2rem,6vw,3.75rem)] leading-[0.95] tracking-[-0.03em] mb-12 sm:mb-16 max-w-3xl font-medium">
          O que estão{" "}
          <span className="italic text-primary font-serif-display font-normal">
            falando.
          </span>
        </h2>

        <div className="grid md:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden">
          {testimonials.map((t, i) => (
            <figure key={i} className="bg-background p-7 sm:p-8 flex flex-col">
              <span
                className="font-serif-display text-5xl text-primary leading-none mb-3"
                aria-hidden
              >
                “
              </span>
              <blockquote className="font-display text-[17px] leading-[1.45] tracking-tight font-normal flex-1">
                {t.q}
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-white/10">
                <p className="text-sm font-semibold">{t.a}</p>
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mt-0.5">
                  {t.r}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="border-t border-white/10 max-w-6xl mx-auto px-5 sm:px-6 py-16 sm:py-24">
        <div className="flex items-baseline gap-3 mb-10 sm:mb-12">
          <span className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground uppercase">
            04 — O essencial
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <h2 className="font-display text-[clamp(2rem,6vw,3.75rem)] leading-[0.95] tracking-[-0.03em] mb-12 sm:mb-16 max-w-3xl font-medium">
          Tudo que importa.{" "}
          <span className="italic text-muted-foreground font-serif-display font-normal">
            Nada que não.
          </span>
        </h2>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-12 sm:gap-y-14">
          {[
            {
              n: "I",
              t: "Lançamentos rápidos",
              d: "Adicione receita ou despesa em três toques. Sem formulários quilométricos.",
            },
            {
              n: "II",
              t: "Metas que importam",
              d: "Crie quantas quiser — viagem, reserva, troca de carro. Sem se afogar em telas.",
            },
            {
              n: "III",
              t: "Análise por IA",
              d: "Uma leitura honesta do seu mês. Onde sobrou, onde escapou, e o que mudar.",
            },
            {
              n: "IV",
              t: "Categorias suas",
              d: "Crie, renomeie, apague. O app se adapta a você — não o contrário.",
            },
          ].map((f) => (
            <div key={f.n} className="flex gap-5">
              <span className="font-display italic text-primary text-base pt-1.5 shrink-0 w-6">
                {f.n}.
              </span>
              <div>
                <h3 className="font-display text-2xl mb-2 tracking-tight font-medium">
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

      {/* ===== FAQ ===== */}
      <section className="border-t border-white/10 bg-card/30">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 py-16 sm:py-24">
          <div className="flex items-baseline gap-3 mb-10 sm:mb-12">
            <span className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground uppercase">
              05 — Dúvidas frequentes
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <h2 className="font-display text-[clamp(2rem,6vw,3.75rem)] leading-[0.95] tracking-[-0.03em] mb-10 sm:mb-12 font-medium">
            Antes que{" "}
            <span className="italic text-primary font-serif-display font-normal">
              você pergunte.
            </span>
          </h2>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-5 sm:py-6 text-left group"
                    aria-expanded={open}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-lg sm:text-xl tracking-tight font-medium">
                        {f.q}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 text-muted-foreground transition-transform ${
                        open ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      open
                        ? "grid-rows-[1fr] opacity-100 pb-6"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-[15px] leading-relaxed text-muted-foreground pl-9 sm:pl-10 pr-8 max-w-2xl">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== PLANS ===== */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 py-16 sm:py-24">
        <div className="flex items-baseline gap-3 mb-10 sm:mb-12">
          <span className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground uppercase">
            06 — Planos
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-white/10 rounded-2xl overflow-hidden">
          <div className="bg-background p-7 sm:p-10">
            <div className="flex items-baseline justify-between mb-1">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                Free
              </p>
              <p className="font-display text-3xl font-medium">R$ 0</p>
            </div>
            <p className="text-xs text-muted-foreground mb-6">pra sempre</p>
            <ul className="space-y-3 text-sm">
              {["50 transações por mês", "Categorias básicas", "Resumo mensal"].map(
                (x) => (
                  <li key={x} className="flex items-start gap-3">
                    <span className="text-primary mt-1">—</span>
                    <span>{x}</span>
                  </li>
                )
              )}
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

          <div className="bg-background p-7 sm:p-10 relative">
            <div className="flex items-baseline justify-between mb-1">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold">
                Premium
              </p>
              <p className="font-serif-display text-3xl text-gold italic">
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
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16 sm:py-24 grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
              07 — Hora de começar
            </span>
            <h2 className="font-display mt-4 text-[clamp(2.25rem,7vw,4.5rem)] leading-[0.95] tracking-[-0.03em] font-medium">
              Cinco minutos.{" "}
              <span className="italic text-primary font-serif-display font-normal">
                Um mês inteiro
              </span>{" "}
              de clareza.
            </h2>
          </div>
          <div className="md:col-span-4 flex md:justify-end">
            <Link
              to="/login?mode=signup"
              className="group inline-flex items-center gap-3 pl-5 sm:pl-6 pr-2 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition"
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
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            © {new Date().getFullYear()} Finanças Pro
          </p>
          <p className="font-serif-display text-xs italic text-muted-foreground">
            Feito com calma, no Brasil.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Landing;
