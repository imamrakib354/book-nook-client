import { Suspense } from "react";

import AllBooks from "@/components/allBooks";
import { BooksGridSkeleton } from "@/components/loading-skeletons";
import type { IBook } from "@/lib/types/IBook";

const Books = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  let books: IBook[];

  try {
    const response = await fetch(`${apiUrl}/books`, { cache: "no-store" });
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

      <Suspense fallback={<BooksGridSkeleton />}>
        <Books />
      </Suspense>
    </div>
  </main>
);

export default AllBooksPage;
