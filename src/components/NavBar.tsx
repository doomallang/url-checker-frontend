"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function NavBar() {
  const { auth, logout } = useAuth();

  return (
    <nav className="border-b bg-white/80 backdrop-blur px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold">
            Uptime
          </Link>
          <Link
            href="/uptime"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Dashboard
          </Link>
        </div>

        {auth.token ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {auth.email ?? "Logged in"}
            </span>
            <button
              onClick={logout}
              className="text-sm rounded-full px-3 py-1.5 bg-gray-900 text-white hover:bg-black transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/signup" className="text-sm underline">
              Sign up
            </Link>
            <Link
              href="/login"
              className="text-sm rounded-full px-3 py-1.5 bg-gray-900 text-white hover:bg-black"
            >
              Log in
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
