const base = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") || "";

function authHeaders(): Record<string, string> {
  const h: Record<string, string> = {};
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) h.Authorization = `Bearer ${token}`;
  }
  return h;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    cache: "no-store",
    headers: { ...authHeaders() },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${path} -> ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} -> ${res.status}`);
  return res.json() as Promise<T>;
}

export async function apiPut<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${path} -> ${res.status}`);
  return res.json() as Promise<T>;
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${base}${path}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`DELETE ${path} -> ${res.status}`);
}
