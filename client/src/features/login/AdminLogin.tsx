import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";

const AdminLogin = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    const res = await fetch(`${API_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ pin }),
    });

    const contentType = res.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      throw new Error(text || `Request failed with status ${res.status}`);
    }

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Login failed.");
      return;
    }

    navigate("/admin/guests");
  } catch (err) {
    setError(err instanceof Error ? err.message : "Login failed.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="grid gap-4 w-full max-w-sm">
        <h1 className="text-3xl font-bold">Admin Login</h1>
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="border rounded px-4 py-2"
          placeholder="4-digit PIN"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button className="bg-black text-white rounded px-4 py-2">
          Enter
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
