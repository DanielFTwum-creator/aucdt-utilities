import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function Login() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin") { // Simple hardcoded password for demo
      localStorage.setItem("isAdmin", "true");
      navigate("/admin/diagnostics");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <form onSubmit={handleLogin} className="bg-[var(--bg-elevated)] p-8 border border-[var(--border-subtle)] w-full max-w-md">
        <h1 className="font-masthead text-3xl mb-6 text-center text-[var(--accent-red)]">ADMIN ACCESS</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="ENTER PASSWORD"
          className="w-full p-3 mb-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] font-mono text-sm focus:outline-none focus:border-[var(--accent-red)]"
        />
        <button type="submit" className="w-full bg-[var(--accent-red)] text-white p-3 font-label uppercase tracking-widest hover:bg-opacity-90">
          LOGIN
        </button>
      </form>
    </div>
  );
}
