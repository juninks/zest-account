import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Crown, RefreshCw, Search, Shield, ArrowLeft, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/admin";
import { listAllUsers, setPremium, AdminUserRow } from "@/lib/adminPremium";

const Admin = () => {
  const { user, loading } = useAuth();
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [query, setQuery] = useState("");
  const [busyUid, setBusyUid] = useState<string | null>(null);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  const refresh = async () => {
    setLoadingList(true);
    try {
      const data = await listAllUsers();
      setRows(data);
    } catch (e: any) {
      toast.error("Erro ao carregar: " + (e?.message ?? "desconhecido"));
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin(user)) refresh();
  }, [user]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.uid.toLowerCase().includes(q) ||
        (r.email ?? "").toLowerCase().includes(q) ||
        (r.whatsapp ?? "").toLowerCase().includes(q)
    );
  }, [rows, query]);

  const togglePremium = async (row: AdminUserRow) => {
    setBusyUid(row.uid);
    try {
      await setPremium(row.uid, !row.premium, row.email);
      toast.success(`Premium ${!row.premium ? "ativado" : "desativado"} para ${row.email ?? row.uid.slice(0, 8)}`);
      await refresh();
    } catch (e: any) {
      toast.error("Falha: " + (e?.message ?? "erro"));
    } finally {
      setBusyUid(null);
    }
  };

  const copyUid = (uid: string) => {
    navigator.clipboard.writeText(uid);
    setCopiedUid(uid);
    toast.success("UID copiado");
    setTimeout(() => setCopiedUid(null), 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-xs text-muted-foreground animate-pulse">Carregando…</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  if (!isAdmin(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="surface-card p-6 max-w-sm text-center">
          <Shield className="w-10 h-10 text-gold mx-auto mb-3" />
          <h1 className="text-lg font-bold mb-2">Página não encontrada</h1>
          <p className="text-xs text-muted-foreground mb-4">
            A página solicitada não existe ou foi movida.
          </p>
          <Link to="/" className="text-xs text-gold underline">
            ← Voltar para o início
          </Link>
        </div>
      </div>
    );
  }

  const totalPremium = rows.filter((r) => r.premium).length;

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-5">
        <Link to="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Voltar ao app
        </Link>
        <button
          onClick={refresh}
          disabled={loadingList}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-secondary border border-white/10 hover:border-gold disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingList ? "animate-spin" : ""}`} /> Atualizar
        </button>
      </header>

      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "var(--gradient-btn-gold)" }}>
          <Shield className="w-6 h-6 text-background" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gold">Painel Admin</h1>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            {rows.length} usuários · {totalPremium} premium
          </p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por email, UID ou WhatsApp…"
          className="input-styled pl-10"
        />
      </div>

      {loadingList ? (
        <p className="text-center text-xs text-muted-foreground py-10 animate-pulse">Carregando usuários…</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-xs text-muted-foreground py-10">
          {rows.length === 0
            ? "Nenhum documento encontrado em users/ ou premium_requests/."
            : "Nenhum resultado para essa busca."}
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((row) => (
            <li key={row.uid} className="surface-card p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold truncate">{row.email ?? "(sem email)"}</p>
                  <button
                    onClick={() => copyUid(row.uid)}
                    className="font-mono text-[10px] text-muted-foreground hover:text-gold flex items-center gap-1 truncate max-w-full"
                  >
                    <span className="truncate">{row.uid}</span>
                    {copiedUid === row.uid ? <Check className="w-3 h-3 text-primary flex-shrink-0" /> : <Copy className="w-3 h-3 flex-shrink-0" />}
                  </button>
                  {row.whatsapp && (
                    <p className="font-mono text-[10px] text-muted-foreground mt-0.5">📱 {row.whatsapp}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground">
                      {row.source}
                    </span>
                    {row.status && (
                      <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground">
                        {row.status}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => togglePremium(row)}
                  disabled={busyUid === row.uid}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition flex-shrink-0 disabled:opacity-50 ${
                    row.premium
                      ? "bg-gold/20 border border-gold/40 text-gold hover:bg-gold/30"
                      : "bg-secondary border border-white/10 hover:border-gold"
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  {busyUid === row.uid ? "..." : row.premium ? "Premium ✓" : "Ativar"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 surface-card p-4">
        <p className="text-xs font-bold mb-2">💡 Como funciona</p>
        <ul className="text-[11px] text-muted-foreground space-y-1 leading-relaxed">
          <li>• Ao ativar, o sistema escreve <code className="text-gold">premium: true</code> em <code className="text-gold">users/{`{uid}`}</code>.</li>
          <li>• O app do cliente atualiza em tempo real (sem precisar recarregar).</li>
          <li>• <strong>source</strong> indica de onde o documento veio (users, premium_requests ou both).</li>
          <li>• Para liberar admin a outras contas, edite <code className="text-gold">src/lib/admin.ts</code>.</li>
        </ul>
      </div>
    </div>
  );
};

export default Admin;
