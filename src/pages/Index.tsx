import { useAuth } from "@/contexts/AuthContext";
import Login from "./Login";
import Dashboard from "./Dashboard";

const Index = () => {
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

  return user ? <Dashboard /> : <Login />;
};

export default Index;
