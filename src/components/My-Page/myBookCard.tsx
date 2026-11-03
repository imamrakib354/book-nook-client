import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import type { IBook } from "@/lib/types/IBook";
import EditBook from "@/components/My-Page/editBook";
import DeleteBook from "@/components/My-Page/deleteBook";

const MyBookCard = ({ book }: { book: IBook }) => (
  <div className="grid gap-3 py-4 text-sm text-[#d9e3e0] sm:grid-cols-[minmax(0,2fr)_minmax(0,0.8fr)_minmax(0,0.5fr)_auto] sm:items-center sm:gap-4">
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-14 w-10 shrink-0 items-center justify-center overflow-hidden rounded bg-[#294344]">
        {book.coverUrl ? (
          <Image src={book.coverUrl} alt="" width={40} height={56} unoptimized className="h-full w-full object-contain" />
        ) : (
          <BookOpen aria-hidden="true" className="size-5 text-[#a9e9cd]" />
        )}
      </div>
      <div className="min-w-0">
        <Link href={`/all-books/${book._id}`} className="block truncate hover:text-[#a9e9cd] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-[#a9e9cd]">
          {book.title}
        </Link>
        <p className="mt-1 truncate text-xs text-[#9badae]">{book.author}</p>
      </div>
    </div>
    <p className="text-xs text-[#a7b8b8] sm:text-sm"><span className="sm:hidden">Category: </span>{book.category}</p>
    <p className="text-xs text-[#a9e9cd] sm:text-sm"><span className="sm:hidden">Copies: </span>{book.copies}</p>
    
    <div className="flex gap-2 sm:justify-end">

      <EditBook book={book} />

      <DeleteBook id={book._id} />

    </div>
  </div>
);

export default MyBookCard;
