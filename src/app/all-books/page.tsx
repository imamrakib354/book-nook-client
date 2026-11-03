import { Suspense } from "react";

import AllBooks from "@/components/allBooks";
import type { IBook } from "@/lib/types/IBook";

const BooksSkeleton = () => (
  <section aria-label="Loading books" className="mt-10 animate-pulse">
    <div className="h-4 w-36 rounded bg-[#223638]" />
    <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-xl bg-[#172b2c] p-3">
          <div className="h-64 rounded-lg bg-[#294344]" />
          <div className="mt-4 h-3 w-32 rounded bg-[#294344]" />
          <div className="mt-4 h-6 w-3/4 rounded bg-[#294344]" />
          <div className="mt-2 h-4 w-1/2 rounded bg-[#294344]" />
        </div>
      ))}
    </div>
  </section>
);

const Books = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  let books: IBook[];

  try {
    const response = await fetch(`${apiUrl}/all-books`, { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load books.");
    books = (await response.json()) as IBook[];
  } catch {
    return <p role="alert" className="mt-10 text-[#f3b7a8]">Unable to load books. Please try again later.</p>;
  }

  return <AllBooks books={books} />;
};

const AllBooksPage = () => (
  <main className="flex-1 bg-[#0b191a] px-5 py-12 text-white sm:px-8 sm:py-16 lg:px-10">
    <div className="mx-auto max-w-6xl">
      <h1 className="font-[family-name:var(--font-dm-serif)] text-3xl text-[#fffaf1] sm:text-4xl">
        Explore all books
      </h1>
      <p className="mt-1 text-sm text-[#a7b8b8]">A collection brought together by readers like you.</p>

      <Suspense fallback={<BooksSkeleton />}>
        <Books />
      </Suspense>
    </div>
  </main>
);

export default AllBooksPage;
