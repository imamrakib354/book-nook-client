import Image from "next/image";
import Link from "next/link";

import type { IBook } from "@/lib/types/IBook";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import BorrowBook from "@/components/My-Borrows-Page/borrowBook";


const BookDetailsPage = async ({ book, user }: { book: IBook; user: { name: string; email: string } }) => {
  let suggestions: IBook[] = [];
  let suggestionsFailed = false;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = await getTokenFromServer();
    const response = await fetch(
      `${apiUrl}/books?category=${encodeURIComponent(book.category)}`,
      {
        headers: { authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );
    
    if (!response.ok) throw new Error("Unable to load similar books.");

    const categoryBooks: IBook[] = await response.json();

    suggestions = categoryBooks
      .filter((suggestion) => suggestion._id !== book._id && suggestion.category === book.category)
      .slice(0, 3);
  } catch {
    suggestionsFailed = true;
  }

  const copies = Number(book.copies);
  const available = copies > 0;

  return (
    <main className="flex-1 bg-background px-5 py-10 text-foreground sm:px-8 sm:py-14 lg:px-10">
      <div className="site-container">
        <nav aria-label="Breadcrumb" className="mb-7 text-xs text-muted-foreground">
          <Link href="/all-books" className="hover:text-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary">All Books</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <Link href="/all-books" className="hover:text-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary">{book.category}</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span className="text-foreground">{book.title}</span>
        </nav>

        <div className="grid gap-9 md:grid-cols-2 lg:gap-12">
          <div className="surface-panel flex min-h-[420px] items-center justify-center rounded-xl p-7 sm:min-h-[480px] sm:p-10">
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
            <Link href="/all-books" className="self-start text-xs font-medium uppercase tracking-widest text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary">
              {book.category} <span aria-hidden="true">·</span> Community pick
            </Link>
            <h1 className="mt-7 font-[family-name:var(--font-dm-serif)] text-4xl leading-tight text-foreground sm:text-5xl">
              {book.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">by {book.author}</p>
            <p className="mt-7 whitespace-pre-line text-sm leading-7 text-foreground">{book.description}</p>

            <div className="surface-panel mt-9 rounded-xl p-6">
              <p className="text-xl text-primary">
                {available ? `${copies} ${copies === 1 ? "copy" : "copies"} available` : "Currently unavailable"}
              </p>
              <p className="mt-3 text-sm text-foreground">Shared by {book.ownerName}</p>
              <p className="mt-5 text-sm text-muted-foreground">Borrowing period <span className="ml-2 text-foreground">{book.borrowDays} days</span></p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <BorrowBook book={book} user={user} />
              <Link href="/all-books" className="flex h-11 min-w-36 items-center justify-center rounded-lg bg-muted px-5 text-sm text-foreground hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                Back to all books
              </Link>
            </div>
          </div>
        </div>

        <section aria-labelledby="suggestions-heading" className="mt-14 sm:mt-20">
          <h2 id="suggestions-heading" className="font-[family-name:var(--font-dm-serif)] text-2xl text-foreground sm:text-3xl">
            You might also like
          </h2>
          {suggestionsFailed ? (
            <p className="mt-5 text-sm text-muted-foreground">Similar books could not be loaded right now.</p>
          ) : suggestions.length === 0 ? (
            <p className="mt-5 text-sm text-muted-foreground">No other books in this category yet.</p>
          ) : (
            <div className="mt-5 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
              {suggestions.map((suggestion) => (
                <Link
                  key={suggestion._id}
                  href={`/all-books/${suggestion._id}`}
                  className="group rounded-lg bg-card p-3 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <div className="flex h-48 items-center justify-center overflow-hidden rounded-md bg-muted sm:h-56">
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
                      <span className="px-3 text-center font-[family-name:var(--font-dm-serif)] text-lg text-foreground">{suggestion.title}</span>
                    )}
                  </div>
                  <p className="mt-3 font-[family-name:var(--font-dm-serif)] text-lg text-foreground">{suggestion.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{suggestion.author}</p>
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
