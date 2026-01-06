"use client";

import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { logoutSession } from "../../../services/auth/logout/logoutAuth.service";
import styles from "./logout.module.css";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutSession();
      router.replace("/");
    } catch (error) {
      console.error("Erro ao sair:", error);
      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      className={styles.logoutBtn} 
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? (
        <Loader2 size={20} className={styles.spinner} />
      ) : (
        <LogOut size={20} />
      )}
      {loading ? "Encerrando..." : "Encerrar Sessão"}
    </button>
  );
}