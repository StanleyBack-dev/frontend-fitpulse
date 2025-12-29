const API_BASE = process.env.NEXT_PUBLIC_API_URL; 

// --- Sua função existente ---
export const checkSession = async () => {
  try {
    // console.log("[DEBUG] Fetch para /refresh iniciado");
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      credentials: "include", // Envia o cookie para validar
    });

    if (!res.ok) {
      return { authenticated: false };
    }

    const data = await res.json();
    return { authenticated: true, ...data };
  } catch (err) {
    console.error("[DEBUG] Erro no fetch checkSession:", err);
    return { authenticated: false };
  }
};

// --- NOVA FUNÇÃO DE LOGOUT ---
export const logoutSession = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // MUITO IMPORTANTE: 'include' garante que o cookie refreshToken 
      // seja enviado para o backend poder limpar ele (res.clearCookie)
      credentials: "include", 
      body: JSON.stringify({}), // Corpo vazio, já que o back lê o cookie também
    });

    // Se deu sucesso (200) ou se o token já estava expirado (401),
    // consideramos que o usuário saiu.
    return true; 
  } catch (err) {
    console.error("Erro ao tentar logout no backend:", err);
    // Mesmo com erro de rede, retornamos true para o front limpar a tela e redirecionar
    return true; 
  }
};