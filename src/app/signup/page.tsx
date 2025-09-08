"use client";
import { useState } from "react";
import { apiPost } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await apiPost<{ token: string }>(`/api/v1/auth/signup`, {
        email,
        password: pw,
        displayName: name,
      });
      login(res.token, email);
      router.push("/uptime");
    } catch (e: any) {
      setErr(e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-4">Sign up</h1>
      <form
        onSubmit={onSubmit}
        className="space-y-3 bg-white rounded-2xl border p-4 shadow-sm"
      >
        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Display name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Password"
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        {err && <div className="text-sm text-red-600">{err}</div>}
        <button
          disabled={loading}
          className="w-full rounded-lg bg-gray-900 text-white py-2 hover:bg-black"
        >
          {loading ? "Signing up…" : "Create account"}
        </button>
      </form>
    </main>
  );
}
