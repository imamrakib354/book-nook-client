import { Suspense } from "react";

import { requireSession } from "@/lib/require-session";

async function AuthenticatedBorrows() {
  await requireSession();
  return (
    <main className="flex-1 bg-[#0b191a] px-5 py-12 text-white sm:px-8 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-[family-name:var(--font-dm-serif)] text-3xl text-[#fffaf1] sm:text-4xl">My borrows</h1>
        <p className="mt-9 rounded-xl bg-[#172b2c] p-8 text-center text-[#a7b8b8]">Borrowing is coming soon.</p>
      </div>
    </main>
  );
}

export default function MyBorrowsPage() {
  return <Suspense fallback={<main className="flex-1 bg-[#0b191a]" />}><AuthenticatedBorrows /></Suspense>;
}
