import { Suspense } from "react";
import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";

import MyBookCard from "@/components/myBookCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import type { IBook } from "@/lib/types/IBook";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const labelClass = "mb-2 text-xs font-normal text-[#b7c6c5]";
const inputClass = "h-11 border-0 bg-[#223638] px-3 text-white placeholder:text-[#91a4a4] focus-visible:border-[#a9e9cd] focus-visible:ring-[#a9e9cd]/30";

type MyBooksPageProps = {
  searchParams: Promise<{ email?: string | string[] }>;
};

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

const MyBooksContent = async ({ searchParams }: MyBooksPageProps) => {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email.trim() : "";
  let books: IBook[] = [];
  let loadError = false;

  if (email) {
    try {
      const response = await fetch(`${apiUrl}/my-books?email=${encodeURIComponent(email)}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load your books.");
      books = (await response.json()) as IBook[];
    } catch {
      loadError = true;
    }
  }

  const totalCopies = books.reduce((total, book) => total + (Number(book.copies) || 0), 0);
  const availableBooks = books.filter((book) => Number(book.copies) > 0).length;

  return (
    <>
      <form method="get" action="/my-books" className="mt-9 rounded-xl bg-[#172b2c] p-5 sm:p-6">
        <Label htmlFor="reader-email" className={labelClass}>Your email</Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="reader-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Enter the email you used to share books"
            defaultValue={email}
            required
            className={inputClass}
          />
          <button type="submit" className="h-11 shrink-0 rounded-lg bg-[#a9e9cd] px-6 text-sm font-medium text-[#102625] hover:bg-[#c4f4dc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd]">
            View my books
          </button>
        </div>
        <p className="mt-2 text-xs text-[#9badae]">Use the same email you entered when adding a book.</p>
      </form>

      {!email ? (
        <p className="mt-10 rounded-xl bg-[#172b2c] p-8 text-center text-[#a7b8b8]">Enter your email above to see the books you shared.</p>
      ) : loadError ? (
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

          <div className="mt-9 grid items-end gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(10rem,0.4fr)_auto]">
            <div>
              <Label htmlFor="my-book-search" className={labelClass}>Search my books</Label>
              <Input id="my-book-search" type="search" placeholder="Find a book..." className={inputClass} />
            </div>
            <div>
              <Label htmlFor="my-book-sort" className={labelClass}>Sort</Label>
              <NativeSelect id="my-book-sort" defaultValue="latest" className="w-full [&_select]:h-11 [&_select]:border-0 [&_select]:bg-[#223638] [&_select]:px-3 [&_select]:text-white [&_svg]:text-[#b7c6c5]">
                <NativeSelectOption value="latest">Newest first</NativeSelectOption>
                <NativeSelectOption value="oldest">Oldest first</NativeSelectOption>
              </NativeSelect>
            </div>
            <Link href="/add-book" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#a9e9cd] px-6 text-sm font-medium text-[#102625] hover:bg-[#c4f4dc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd]">
              <Plus aria-hidden="true" className="size-4" /> Add book
            </Link>
          </div>

          {books.length === 0 ? (
            <EmptyBooks />
          ) : (
            <section aria-label="Books you shared" className="mt-10 rounded-xl bg-[#172b2c] p-4 sm:p-6">
              <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,0.8fr)_minmax(0,0.5fr)_auto] gap-4 pb-4 text-xs uppercase tracking-wide text-[#9badae] sm:grid">
                <span>Book / Author</span>
                <span>Category</span>
                <span>Copies</span>
                <span className="text-right">Actions</span>
              </div>
              <div className="divide-y divide-white/5">
                {books.map((book) => <MyBookCard key={book._id} book={book} />)}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
};

const MyBooksPage = (props: MyBooksPageProps) => (
  <main className="flex-1 bg-[#0b191a] px-5 py-12 text-white sm:px-8 sm:py-16 lg:px-10">
    <div className="mx-auto max-w-6xl">
      <h1 className="font-[family-name:var(--font-dm-serif)] text-3xl text-[#fffaf1] sm:text-4xl">My shared books</h1>
      <p className="mt-1 text-sm text-[#a7b8b8]">Manage the books you have contributed to the community.</p>
      <Suspense fallback={<MyBooksSkeleton />}>
        <MyBooksContent searchParams={props.searchParams} />
      </Suspense>
    </div>
  </main>
);

export default MyBooksPage;
