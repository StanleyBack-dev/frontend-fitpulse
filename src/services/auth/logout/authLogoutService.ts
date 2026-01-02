const API_BASE = process.env.NEXT_PUBLIC_API_URL; 

export const logoutSession = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
      body: JSON.stringify({}),
    });

    return true;

  } catch (err) {
    
    return true; 
  }
};