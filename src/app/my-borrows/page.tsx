import { Suspense } from "react";

import { requireSession } from "@/lib/require-session";
import MyBorrows from "@/components/My-Borrows-Page/myBorrows";
import type { IBorrow } from "@/lib/types/IBorrow";

async function AuthenticatedBorrows() {
  const { user } = await requireSession();
  let borrows: IBorrow[] = [];
  let loadError = false;
  // eslint-disable-next-line react-hooks/purity -- Request-time snapshot in an async Server Component.
  const now = Date.now();

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    const response = await fetch(`${apiUrl}/my-borrows/${encodeURIComponent(user.email)}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load borrowed books");
    borrows = await response.json();

    for (const borrow of borrows) {
      if (new Date(borrow.dueDate).getTime() <= now) {
        const response = await fetch(`${apiUrl}/my-borrows/${borrow._id}`, {
          method: "DELETE",
        });
        const result = await response.json();
        if (response.status !== 404 && (!response.ok || result.deletedCount !== 1)) {
          throw new Error("Unable to return expired book");
        }
      }
    }
  } catch {
    loadError = true;
  }

  return (
    <main className="flex-1 bg-[#0b191a] px-5 py-12 text-white sm:px-8 sm:py-16 lg:px-10">

      <div className="mx-auto max-w-6xl">
        <h1 className="font-[family-name:var(--font-dm-serif)] text-3xl text-[#fffaf1] sm:text-4xl">My borrowed books</h1>
        <p className="mt-1 text-sm text-[#a7b8b8]">Stay on top of every story you are reading.</p>
        {loadError ? <p role="alert" className="mt-10 rounded-xl bg-[#172b2c] p-8 text-center text-[#f3b7a8]">Unable to load your borrowed books. Please try again later.</p> : <MyBorrows borrows={borrows} now={now} />}
      </div>
      
    </main>
  );
}

export default function MyBorrowsPage() {
  return <Suspense fallback={<main className="flex-1 bg-[#0b191a]" />}><AuthenticatedBorrows /></Suspense>;
}
