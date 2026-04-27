import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Wallet } from "lucide-react";

const Login = () => {
  const { loginAnon, loginEmail, signupEmail } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") await loginEmail(email, password);
      else await signupEmail(email, password);
      toast.success(mode === "login" ? "Bem-vindo!" : "Conta criada!");
    } catch (err: any) {
      toast.error(err.message ?? "Erro");
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
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="w-[76px] h-[76px] rounded-[22px] flex items-center justify-center text-3xl mb-4 glow-primary"
          style={{ background: "var(--gradient-primary)" }}>
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
          {mode === "login" ? "Entrar" : "Criar conta"}
        </h2>
        <p className="font-mono text-[11px] text-muted-foreground mb-5">
          {mode === "login" ? "Acesse sua conta" : "Comece em segundos"}
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
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block">
              Senha
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-styled"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-primary-foreground tracking-wide transition-all hover:-translate-y-px disabled:opacity-50 mt-2"
            style={{ background: "var(--gradient-btn-primary)", boxShadow: "var(--shadow-card)" }}
          >
            {mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-2.5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">ou</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button
          onClick={anon}
          disabled={busy}
          className="w-full py-3.5 rounded-xl font-bold text-sm bg-secondary border border-white/10 hover:border-white/20 transition-all"
        >
          Continuar anônimo
        </button>

        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="w-full py-3 mt-2 text-xs text-muted-foreground hover:text-foreground transition"
        >
          {mode === "login" ? "Não tem conta? Criar" : "Já tem conta? Entrar"}
        </button>

        <p className="font-mono text-[10px] text-muted-foreground text-center leading-relaxed mt-3.5">
          Modo anônimo cria um ID temporário.<br />Seus dados ficam vinculados a este dispositivo.
        </p>
      </section>
    </main>
  );
};

export default Login;
