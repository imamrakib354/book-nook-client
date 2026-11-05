import { Suspense } from "react";
import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";

import MyBooks from "@/components/My-Page/myBooks";
import { MyBooksSkeleton } from "@/components/loading-skeletons";
import type { IBook } from "@/lib/types/IBook";
import { getCurrentUser } from "@/lib/get-current-user";
import { getTokenFromServer } from "@/lib/getTokenFromServer";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const EmptyBooks = () => (
  <div className="mt-10 rounded-2xl border border-border bg-card px-6 py-12 text-center sm:py-16">
    <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-muted text-primary">
      <BookOpen aria-hidden="true" className="size-9" />
    </div>
    <h2 className="mt-5 text-2xl font-semibold text-foreground">No books shared yet</h2>
    <p className="mt-3 text-sm text-muted-foreground">Please add a book to start sharing with the community.</p>
    <Link href="/add-book" className="mx-auto mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
      <Plus aria-hidden="true" className="size-4" /> Add a book
    </Link>
  </div>
);

const MyBooksContent = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  let books: IBook[] = [];
  let loadError = false;

  try {
    const token = await getTokenFromServer();
    const response = await fetch(`${apiUrl}/books?mine=true`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to load your books.");
    books = (await response.json()) as IBook[];
    books = books.filter((book) => book.ownerEmail?.toLowerCase() === user.email.toLowerCase());
  } catch {
    loadError = true;
  }

  const totalCopies = books.reduce((total, book) => total + (Number(book.copies) || 0), 0);
  const availableBooks = books.filter((book) => Number(book.copies) > 0).length;

  return (
    <>
      {loadError ? (
        <p role="alert" className="mt-10 rounded-xl bg-card p-8 text-center text-red-700 dark:text-[#f3b7a8]">Unable to load your books. Please try again later.</p>
      ) : (
        <>
          <section aria-label="Your book statistics" className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { value: books.length, label: "Books shared" },
              { value: totalCopies, label: "Total copies" },
              { value: availableBooks, label: "Currently available" },
            ].map(({ value, label }) => (
              <div key={label} className="surface-panel flex min-h-24 items-center gap-6 rounded-xl px-6 py-5">
                <span className="font-[family-name:var(--font-dm-serif)] text-3xl text-primary">{value}</span>
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </section>

          <MyBooks books={books}>
            <EmptyBooks />
          </MyBooks>
        </>
      )}
    </>
  );
};

const MyBooksPage = () => (
  <main className="flex-1 bg-background px-5 py-12 text-foreground sm:px-8 sm:py-16 lg:px-10">
    <div className="site-container">
      <h1 className="font-[family-name:var(--font-dm-serif)] text-3xl text-foreground sm:text-4xl">My shared books</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage the books you have contributed to the community.</p>
      <Suspense fallback={<MyBooksSkeleton />}>
        <MyBooksContent />
      </Suspense>
    </div>
  </main>
);

export default MyBooksPage;
