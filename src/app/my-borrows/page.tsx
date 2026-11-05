import { Suspense } from "react";
import { PageSkeleton } from "@/components/loading-skeletons";

import { getCurrentUser } from "@/lib/get-current-user";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import MyBorrows from "@/components/My-Borrows-Page/myBorrows";
import type { IBorrow } from "@/lib/types/IBorrow";

async function AuthenticatedBorrows() {
  const user = await getCurrentUser();
  if (!user) return null;
  let borrows: IBorrow[] = [];
  let loadError = false;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    const token = await getTokenFromServer();
    const response = await fetch(`${apiUrl}/borrows`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Unable to load borrowed books");
    borrows = await response.json();

    borrows = await Promise.all(borrows.map(async (borrow) => {
      if (borrow.author) return borrow;
      try {
        const bookResponse = await fetch(`${apiUrl}/books/${encodeURIComponent(borrow.bookId)}`, {
          headers: { authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!bookResponse.ok) return borrow;
        const book = await bookResponse.json();
        return { ...borrow, author: book?.author };
      } catch {
        // Keep the borrow and Return Book action available if book details cannot be loaded.
        return borrow;
      }
    }));

  } catch {
    loadError = true;
  }

  // eslint-disable-next-line react-hooks/purity -- Request-time snapshot for consistent server/client dates.
  const now = Date.now();

  return (
    <main className="flex-1 bg-background px-5 py-12 text-foreground sm:px-8 sm:py-16 lg:px-10">

      <div className="site-container">
        <h1 className="font-[family-name:var(--font-dm-serif)] text-3xl text-foreground sm:text-4xl">My borrowed books</h1>
        <p className="mt-1 text-sm text-muted-foreground">Stay on top of every story you are reading.</p>
        {loadError ? <p role="alert" className="mt-10 rounded-xl bg-card p-8 text-center text-red-700 dark:text-[#f3b7a8]">Unable to load your borrowed books. Please try again later.</p> : <MyBorrows borrows={borrows} now={now} />}
      </div>
      
    </main>
  );
}

export default function MyBorrowsPage() {
  return <Suspense fallback={<PageSkeleton variant="borrows" />}><AuthenticatedBorrows /></Suspense>;
}
