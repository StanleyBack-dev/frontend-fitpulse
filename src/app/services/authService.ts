export const checkSession = async () => {
  try {
    console.log("[DEBUG] Fetch para /refresh iniciado");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    console.log("[DEBUG] Status do fetch:", res.status);

    if (!res.ok) {
      console.warn("[DEBUG] Resposta não OK");
      return { authenticated: false };
    }

    const data = await res.json();
    console.log("[DEBUG] Dados recebidos:", data);

    return { authenticated: true, ...data };
  } catch (err) {
    console.error("[DEBUG] Erro no fetch checkSession:", err);
    return { authenticated: false };
  }
};