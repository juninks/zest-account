import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "./Dashboard";

const AppPage = () => {
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

  if (!user) return <Navigate to="/" replace />;
  return <Dashboard />;
};

export default AppPage;
