import Image from "next/image";
import Link from "next/link";

import type { IBook } from "@/lib/types/IBook";

const BookCard = ({ book }: { book: IBook }) => (
  <article
    className="group flex h-full flex-col rounded-xl border border-border bg-card p-3"
  >
    <div className="flex h-64 items-center justify-center overflow-hidden rounded-lg bg-muted">
      {book.coverUrl ? (
        <Image
          src={book.coverUrl}
          alt={`Cover of ${book.title}`}
          width={360}
          height={256}
          unoptimized
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <span className="px-6 text-center font-[family-name:var(--font-dm-serif)] text-2xl text-foreground">{book.title}</span>
      )}
    </div>
    <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
      <p className="text-xs text-primary">
        {book.category} <span aria-hidden="true" className="mx-1">·</span> {Number(book.copies) > 0 ? "Available" : "Unavailable"}
      </p>
      <h2 className="mt-3 font-[family-name:var(--font-dm-serif)] text-xl text-foreground">{book.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{book.author}</p>
      <div className="mt-auto pt-5">
        <Link href={`/all-books/${book._id}`} className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          View Details
        </Link>
      </div>
    </div>
  </article>
);

export default BookCard;
