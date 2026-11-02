import { Suspense } from "react";

import BookCard from "@/components/bookCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import type { IBook } from "@/lib/types/IBook";

const labelClass = "mb-2 text-xs font-normal text-[#b7c6c5]";
const selectClass = "w-full [&_select]:h-11 [&_select]:border-0 [&_select]:bg-[#223638] [&_select]:px-3 [&_select]:text-white [&_svg]:text-[#b7c6c5]";

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

  return (
    <section aria-label="Books" className="mt-10">
      <p className="text-sm text-[#9badae]">Showing {books.length} {books.length === 1 ? "book" : "books"}</p>
      {books.length === 0 ? (
        <p className="mt-6 rounded-xl bg-[#172b2c] p-8 text-center text-[#b7c6c5]">No books have been added yet.</p>
      ) : (
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => <BookCard key={book._id} book={book} />)}
        </div>
      )}
    </section>
  );
};

const AllBooksPage = () => (
  <main className="flex-1 bg-[#0b191a] px-5 py-12 text-white sm:px-8 sm:py-16 lg:px-10">
    <div className="mx-auto max-w-6xl">
      <h1 className="font-[family-name:var(--font-dm-serif)] text-3xl text-[#fffaf1] sm:text-4xl">
        Explore all books
      </h1>
      <p className="mt-1 text-sm text-[#a7b8b8]">A collection brought together by readers like you.</p>

      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]" role="group" aria-label="Browse controls">
        <div>
          <Label htmlFor="book-search" className={labelClass}>Search</Label>
          <Input
            id="book-search"
            type="search"
            placeholder="Search by title or author..."
            className="h-11 border-0 bg-[#223638] px-3 text-white placeholder:text-[#91a4a4] focus-visible:border-[#a9e9cd] focus-visible:ring-[#a9e9cd]/30"
          />
        </div>

        <div>
          <Label htmlFor="book-category" className={labelClass}>Category</Label>
          <NativeSelect id="book-category" defaultValue="all" className={selectClass}>
            <NativeSelectOption value="all">All categories</NativeSelectOption>
            <NativeSelectOption value="Fiction">Fiction</NativeSelectOption>
            <NativeSelectOption value="Science">Science</NativeSelectOption>
            <NativeSelectOption value="History">History</NativeSelectOption>
            <NativeSelectOption value="Kids">Kids</NativeSelectOption>
            <NativeSelectOption value="Others">Others</NativeSelectOption>
          </NativeSelect>
        </div>
        
        <div>
          <Label htmlFor="book-sort" className={labelClass}>Sort by</Label>
          <NativeSelect id="book-sort" defaultValue="latest" className={selectClass}>
            <NativeSelectOption value="latest">Newest first</NativeSelectOption>
            <NativeSelectOption value="oldest">Oldest first</NativeSelectOption>
            <NativeSelectOption value="most-borrowed">Most borrowed</NativeSelectOption>
          </NativeSelect>
        </div>
      </div>

      <Suspense fallback={<BooksSkeleton />}>
        <Books />
      </Suspense>
    </div>
  </main>
);

export default AllBooksPage;
