const API_BASE = process.env.NEXT_PUBLIC_API_URL; 

export const checkSession = async () => {
  try {

    const res = await fetch(`${API_BASE}/api/auth/token/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      return { authenticated: false };
    }

    const data = await res.json();
    return { authenticated: true, ...data };

  } catch (err) {
    
    return { authenticated: false };
  }
};