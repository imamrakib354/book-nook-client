import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import type { IBook } from "@/lib/types/IBook";
import EditBook from "@/components/My-Page/editBook";
import DeleteBook from "@/components/My-Page/deleteBook";

const MyBookCard = ({ book }: { book: IBook }) => (
  <div className="grid grid-cols-2 gap-4 py-5 text-sm text-[#d9e3e0] md:grid-cols-[minmax(0,2fr)_minmax(0,0.8fr)_minmax(0,0.5fr)_9rem] md:items-center">
    <div className="col-span-2 flex min-w-0 items-center gap-3 md:col-span-1">
      <div className="flex h-14 w-10 shrink-0 items-center justify-center overflow-hidden rounded bg-[#294344]">
        {book.coverUrl ? (
          <Image src={book.coverUrl} alt="" width={40} height={56} unoptimized className="h-full w-full object-contain" />
        ) : (
          <BookOpen aria-hidden="true" className="size-5 text-[#a9e9cd]" />
        )}
      </div>
      <div className="min-w-0">
        <Link href={`/all-books/${book._id}`} className="block wrap-anywhere hover:text-[#a9e9cd] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-[#a9e9cd]">
          {book.title}
        </Link>
        <p className="mt-1 wrap-anywhere text-xs text-[#9badae]">{book.author}</p>
      </div>
    </div>
    <p className="min-w-0 wrap-anywhere text-[#a7b8b8]"><span className="mb-1 block text-xs text-[#9badae] md:hidden">Category</span>{book.category}</p>
    <p className="text-[#a9e9cd]"><span className="mb-1 block text-xs text-[#9badae] md:hidden">Copies</span>{book.copies}</p>
    
    <div className="col-span-2 flex flex-wrap gap-2 md:col-span-1 md:justify-center">

      <EditBook book={book} />

      <DeleteBook id={book._id} />

    </div>
  </div>
);

export default MyBookCard;
