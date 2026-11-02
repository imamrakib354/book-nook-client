import Image from "next/image";
import Link from "next/link";

import type { IBook } from "@/lib/types/IBook";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const BookDetailsPage = async ({ book }: { book: IBook }) => {
  let suggestions: IBook[] = [];
  let suggestionsFailed = false;

  try {
    const response = await fetch(
      `${apiUrl}/all-books/category/${encodeURIComponent(book.category)}`,
      { cache: "no-store" },
    );
    if (!response.ok) throw new Error("Unable to load similar books.");

    const categoryBooks = (await response.json()) as IBook[];
    suggestions = categoryBooks
      .filter((suggestion) => suggestion._id !== book._id && suggestion.category === book.category)
      .slice(0, 3);
  } catch {
    suggestionsFailed = true;
  }

  const copies = Number(book.copies);
  const available = copies > 0;

  return (
    <main className="flex-1 bg-[#0b191a] px-5 py-10 text-white sm:px-8 sm:py-14 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-7 text-xs text-[#9badae]">
          <Link href="/all-books" className="hover:text-[#a9e9cd] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-[#a9e9cd]">All Books</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <Link href="/all-books" className="hover:text-[#a9e9cd] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-[#a9e9cd]">{book.category}</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span className="text-[#d2dddb]">{book.title}</span>
        </nav>

        <div className="grid gap-9 md:grid-cols-2 lg:gap-12">
          <div className="flex min-h-[420px] items-center justify-center rounded-xl bg-[#172b2c] p-7 sm:min-h-[480px] sm:p-10">
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={`Cover of ${book.title}`}
                width={380}
                height={500}
                unoptimized
                className="max-h-[440px] w-auto max-w-full rounded-md object-contain shadow-xl"
              />
            ) : (
              <div className="flex h-80 w-56 items-center justify-center rounded-md border-l-8 border-[#eac58c] bg-[#315c5d] px-5 text-center font-[family-name:var(--font-dm-serif)] text-2xl text-[#fffaf1]">
                {book.title}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <Link href="/all-books" className="self-start text-xs font-medium uppercase tracking-widest text-[#a9e9cd] underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-[#a9e9cd]">
              {book.category} <span aria-hidden="true">·</span> Community pick
            </Link>
            <h1 className="mt-7 font-[family-name:var(--font-dm-serif)] text-4xl leading-tight text-[#fffaf1] sm:text-5xl">
              {book.title}
            </h1>
            <p className="mt-1 text-sm text-[#a7b8b8]">by {book.author}</p>
            <p className="mt-7 whitespace-pre-line text-sm leading-7 text-[#d9e3e0]">{book.description}</p>

            <div className="mt-9 rounded-xl bg-[#172b2c] p-6">
              <p className="text-xl text-[#a9e9cd]">
                {available ? `${copies} ${copies === 1 ? "copy" : "copies"} available` : "Currently unavailable"}
              </p>
              <p className="mt-3 text-sm text-[#d9e3e0]">Shared by {book.ownerName}</p>
              <p className="mt-5 text-sm text-[#9badae]">Borrowing period <span className="ml-2 text-[#d9e3e0]">{book.borrowDays} days</span></p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" disabled title="Borrowing is coming soon" className="h-11 min-w-44 rounded-lg bg-[#a9e9cd] px-5 text-sm font-medium text-[#102625] disabled:cursor-not-allowed disabled:opacity-75">
                Borrow this book <span aria-hidden="true">→</span>
              </button>
              <Link href="/all-books" className="flex h-11 min-w-36 items-center justify-center rounded-lg bg-[#223638] px-5 text-sm text-[#d2dddb] hover:bg-[#30484a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd]">
                Back to all books
              </Link>
            </div>
          </div>
        </div>

        <section aria-labelledby="suggestions-heading" className="mt-14 sm:mt-20">
          <h2 id="suggestions-heading" className="font-[family-name:var(--font-dm-serif)] text-2xl text-[#fffaf1] sm:text-3xl">
            You might also like
          </h2>
          {suggestionsFailed ? (
            <p className="mt-5 text-sm text-[#a7b8b8]">Similar books could not be loaded right now.</p>
          ) : suggestions.length === 0 ? (
            <p className="mt-5 text-sm text-[#a7b8b8]">No other books in this category yet.</p>
          ) : (
            <div className="mt-5 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
              {suggestions.map((suggestion) => (
                <Link
                  key={suggestion._id}
                  href={`/all-books/${suggestion._id}`}
                  className="group rounded-lg bg-[#172b2c] p-3 transition-colors hover:bg-[#203738] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd]"
                >
                  <div className="flex h-48 items-center justify-center overflow-hidden rounded-md bg-[#294344] sm:h-56">
                    {suggestion.coverUrl ? (
                      <Image
                        src={suggestion.coverUrl}
                        alt={`Cover of ${suggestion.title}`}
                        width={190}
                        height={224}
                        unoptimized
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="px-3 text-center font-[family-name:var(--font-dm-serif)] text-lg text-[#fffaf1]">{suggestion.title}</span>
                    )}
                  </div>
                  <p className="mt-3 font-[family-name:var(--font-dm-serif)] text-lg text-[#fffaf1]">{suggestion.title}</p>
                  <p className="mt-1 text-xs text-[#9badae]">{suggestion.author}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default BookDetailsPage;
