const API_URL = "http://localhost:8080";

export const AuthService = {
  login: async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Login failed");
    }

    const data = await res.json();
    return data;
  },

  logout: async () => {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
  },

  verifyEmailCode: async (username: string, code: string) => {
    const res = await fetch(`${API_URL}/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, code }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Invalid verification code");
    }
  },

  me: async () => {
    const res = await fetch(`${API_URL}/me`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  },
};
