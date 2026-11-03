import { Suspense } from "react";
import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";

import MyBooks from "@/components/My-Page/myBooks";
import type { IBook } from "@/lib/types/IBook";
import { requireSession } from "@/lib/require-session";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const MyBooksSkeleton = () => (
  <div aria-label="Loading your books" className="mt-9 animate-pulse">
    <div className="h-20 rounded-xl bg-[#172b2c]" />
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-24 rounded-xl bg-[#172b2c]" />
      ))}
    </div>
    <div className="mt-9 h-11 rounded-lg bg-[#223638]" />
    <div className="mt-10 space-y-3 rounded-xl bg-[#172b2c] p-5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-14 rounded-lg bg-[#223638]" />
      ))}
    </div>
  </div>
);

const EmptyBooks = () => (
  <div className="mt-10 rounded-2xl border border-[#294344] bg-[#172b2c] px-6 py-12 text-center sm:py-16">
    <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#294344] text-[#a9e9cd]">
      <BookOpen aria-hidden="true" className="size-9" />
    </div>
    <h2 className="mt-5 text-2xl font-semibold text-[#fffaf1]">No books shared yet</h2>
    <p className="mt-3 text-sm text-[#a7b8b8]">Please add a book to start sharing with the community.</p>
    <Link href="/add-book" className="mx-auto mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#a9e9cd] px-6 text-sm font-medium text-[#102625] hover:bg-[#c4f4dc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd]">
      <Plus aria-hidden="true" className="size-4" /> Add a book
    </Link>
  </div>
);

const MyBooksContent = async () => {
  const { user } = await requireSession();
  let books: IBook[] = [];
  let loadError = false;

  try {
    const response = await fetch(`${apiUrl}/my-books?email=${encodeURIComponent(user.email)}`, { cache: "no-store" });
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
        <p role="alert" className="mt-10 rounded-xl bg-[#172b2c] p-8 text-center text-[#f3b7a8]">Unable to load your books. Please try again later.</p>
      ) : (
        <>
          <section aria-label="Your book statistics" className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { value: books.length, label: "Books shared" },
              { value: totalCopies, label: "Total copies" },
              { value: availableBooks, label: "Currently available" },
            ].map(({ value, label }) => (
              <div key={label} className="flex min-h-24 items-center gap-6 rounded-xl bg-[#172b2c] px-6 py-5">
                <span className="font-[family-name:var(--font-dm-serif)] text-3xl text-[#a9e9cd]">{value}</span>
                <span className="text-sm text-[#9badae]">{label}</span>
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
  <main className="flex-1 bg-[#0b191a] px-5 py-12 text-white sm:px-8 sm:py-16 lg:px-10">
    <div className="mx-auto max-w-6xl">
      <h1 className="font-[family-name:var(--font-dm-serif)] text-3xl text-[#fffaf1] sm:text-4xl">My shared books</h1>
      <p className="mt-1 text-sm text-[#a7b8b8]">Manage the books you have contributed to the community.</p>
      <Suspense fallback={<MyBooksSkeleton />}>
        <MyBooksContent />
      </Suspense>
    </div>
  </main>
);

export default MyBooksPage;
