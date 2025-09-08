import Link from "next/link";

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold">Uptime Monitor</h1>
      <p className="mt-2 text-gray-600">
        Minimal dashboard built with Next.js + Tailwind + Recharts.
      </p>
      <Link
        href="/uptime"
        className="inline-block mt-6 px-4 py-2 rounded-xl bg-black text-white"
      >
        Go to Dashboard
      </Link>
    </main>
  );
}
