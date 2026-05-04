import { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft, ArrowUpRight } from "lucide-react";

const Login = () => {
  const { user, loginAnon, loginEmail, signupEmail } = useAuth();
  const [params] = useSearchParams();
  const initialMode = params.get("mode") === "login" ? "login" : "signup";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/app" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") await loginEmail(email, password);
      else await signupEmail(email, password);
      toast.success(mode === "login" ? "Bem-vindo!" : "Conta criada!");
    } catch (err: any) {
      const code = err?.code ?? "";
      if (code === "auth/operation-not-allowed") {
        toast.error("Login por email não está ativado.");
      } else if (code === "auth/email-already-in-use") {
        toast.error("Este email já tem conta. Tente entrar.");
        setMode("login");
      } else if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        toast.error("Email ou senha incorretos.");
      } else {
        toast.error(err.message ?? "Erro");
      }
    } finally {
      setBusy(false);
    }
  };

  const anon = async () => {
    setBusy(true);
    try {
      await loginAnon();
      toast.success("Sessão anônima iniciada");
    } catch (err: any) {
      toast.error(err.message ?? "Erro");
    } finally {
      setBusy(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <main className="relative z-10 min-h-screen">
      {/* Top bar */}
      <header className="max-w-6xl mx-auto px-5 sm:px-6 pt-6 sm:pt-7 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
          <span className="font-display text-[15px] tracking-tight font-medium">
            Finanças<span className="italic text-primary font-serif-display"> Pro</span>
          </span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition font-mono uppercase tracking-widest"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 pt-12 sm:pt-20 pb-16 grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Lado editorial */}
        <section className="lg:col-span-6 hidden lg:block">
          <div className="flex items-center gap-3 mb-7">
            <span className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground uppercase">
              {isLogin ? "00 — Bem-vindo de volta" : "00 — Comece agora"}
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <h1 className="font-display leading-[0.95] tracking-[-0.04em] mb-7">
            <span className="block text-[clamp(2.5rem,6vw,5rem)] font-medium">
              {isLogin ? "Que bom" : "Cinco minutos"}
            </span>
            <span className="block text-[clamp(2.5rem,6vw,5rem)] italic text-primary font-serif-display -mt-1 font-normal">
              {isLogin ? "te ver de novo." : "pra começar."}
            </span>
          </h1>

          <p className="text-[16px] sm:text-[17px] leading-[1.55] text-muted-foreground max-w-md">
            {isLogin
              ? "Entre pra ver onde foi parar o dinheiro do mês. Sem ruído, sem propaganda."
              : "Crie sua conta grátis. Sem cartão, sem pegadinha. 50 transações por mês, pra sempre."}
          </p>

          <div className="mt-10 space-y-3">
            {[
              isLogin ? "Tudo do jeitinho que você deixou" : "Anote, categorize, entenda",
              isLogin ? "Suas categorias, suas metas" : "Crie metas que importam pra você",
              isLogin ? "Análise da IA do mês esperando" : "IA lê seu mês e te conta o que mudou",
            ].map((x, i) => (
              <div key={i} className="flex items-baseline gap-4">
                <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-muted-foreground">{x}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Card de auth */}
        <section className="lg:col-span-6 lg:col-start-8 w-full max-w-md mx-auto lg:mx-0 animate-fade-in">
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <span className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground uppercase">
              {isLogin ? "Acesse" : "Comece"}
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="surface-card p-7 sm:p-8">
            <h2 className="font-display text-[clamp(1.75rem,5vw,2.25rem)] tracking-[-0.02em] font-medium mb-1">
              {isLogin ? (
                <>
                  Entrar na{" "}
                  <span className="italic text-primary font-serif-display font-normal">
                    sua conta.
                  </span>
                </>
              ) : (
                <>
                  Criar uma{" "}
                  <span className="italic text-primary font-serif-display font-normal">
                    conta nova.
                  </span>
                </>
              )}
            </h2>
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase mb-6">
              {isLogin ? "Bem-vindo de volta" : "Em segundos · sem cartão"}
            </p>

            <form onSubmit={submit} className="space-y-3">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                  className="input-styled"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-styled pr-12"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition"
                    aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}
                    tabIndex={-1}
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="group w-full inline-flex items-center justify-between gap-3 pl-5 pr-2 py-2 rounded-full bg-foreground text-background hover:opacity-90 transition disabled:opacity-50 mt-3"
              >
                <span className="text-sm font-bold">
                  {isLogin ? "Entrar" : "Criar conta"}
                </span>
                <span className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:rotate-45 transition-transform">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                ou
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button
              onClick={() => setMode(isLogin ? "signup" : "login")}
              className="w-full text-sm py-2.5 rounded-full border border-white/10 hover:border-primary/40 hover:bg-white/5 transition"
            >
              {isLogin ? (
                <>
                  Não tem conta?{" "}
                  <span className="italic text-primary font-serif-display">
                    Criar agora
                  </span>
                </>
              ) : (
                <>
                  Já tem conta?{" "}
                  <span className="italic text-primary font-serif-display">
                    Entrar
                  </span>
                </>
              )}
            </button>

            <button
              onClick={anon}
              disabled={busy}
              className="w-full mt-2 py-2.5 rounded-full text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition"
            >
              Continuar anônimo
            </button>

            <p className="font-mono text-[10px] text-muted-foreground text-center leading-relaxed mt-4">
              Modo anônimo cria um ID temporário,
              <br />
              vinculado só a este dispositivo.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
