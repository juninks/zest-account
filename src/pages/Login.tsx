import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Wallet, Eye, EyeOff, ArrowLeft } from "lucide-react";

const Login = () => {
  const { loginAnon, loginEmail, signupEmail } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);

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
        toast.error("Login por email não está ativado no Firebase.");
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

  return (
    <main className="min-h-screen flex flex-col justify-center px-6 py-10 max-w-md mx-auto relative z-10 animate-fade-in">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition mb-4 font-mono uppercase tracking-widest"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Voltar
      </Link>

      <div className="flex flex-col items-center mb-10 text-center">
        <div
          className="w-[76px] h-[76px] rounded-[22px] flex items-center justify-center text-3xl mb-4 glow-primary"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Wallet className="w-9 h-9 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Finanças <span className="text-primary">Pro</span>
        </h1>
        <p className="font-mono text-[11px] text-muted-foreground tracking-widest uppercase mt-2">
          Controle inteligente
        </p>
      </div>

      <section className="surface-card p-7 mb-3.5">
        <h2 className="text-xl font-extrabold tracking-tight mb-1">
          {mode === "signup" ? "Criar conta" : "Entrar"}
        </h2>
        <p className="font-mono text-[11px] text-muted-foreground mb-5">
          {mode === "signup" ? "Comece em segundos" : "Acesse sua conta"}
        </p>

        <form onSubmit={submit} className="space-y-2.5">
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
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
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
            className="w-full py-3.5 rounded-xl font-bold text-sm text-primary-foreground tracking-wide transition-all hover:-translate-y-px disabled:opacity-50 mt-2"
            style={{ background: "var(--gradient-btn-primary)", boxShadow: "var(--shadow-card)" }}
          >
            {mode === "signup" ? "Criar conta" : "Entrar"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signup" ? "login" : "signup")}
          className="w-full py-3 mt-3 rounded-xl font-bold text-sm bg-secondary border border-white/10 hover:border-primary/40 transition-all"
        >
          {mode === "signup" ? "Já tem conta? Entrar" : "Não tem conta? Criar"}
        </button>

        <div className="flex items-center gap-3 my-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            ou
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button
          onClick={anon}
          disabled={busy}
          className="w-full py-2.5 rounded-lg text-xs text-muted-foreground hover:text-foreground border border-white/5 hover:border-white/15 transition-all"
        >
          Continuar anônimo
        </button>

        <p className="font-mono text-[10px] text-muted-foreground text-center leading-relaxed mt-3.5">
          Modo anônimo cria um ID temporário.
          <br />
          Seus dados ficam vinculados a este dispositivo.
        </p>
      </section>
    </main>
  );
};

export default Login;
