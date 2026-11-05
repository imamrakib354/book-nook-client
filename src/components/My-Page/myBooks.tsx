"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import MyBookCard from "./myBookCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import type { IBook } from "@/lib/types/IBook";

const MyBooks = ({ books, children }: { books: IBook[]; children: ReactNode }) => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const searchTerm = search.trim().toLowerCase();
  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author}`.toLowerCase().includes(searchTerm)
  );
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === "latest") {
      return b._id.localeCompare(a._id);
    }

    if (sortBy === "oldest") {
      return a._id.localeCompare(b._id);
    }

    return 0;
  });

  return (
    <>
      <div className="filter-bar mt-9 grid items-end gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(10rem,0.4fr)_auto]">
        <div>
          <Label htmlFor="my-book-search" className="mb-2 text-xs font-normal text-muted-foreground">Search my books</Label>
          <Input id="my-book-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title or author..." className="h-11 border-border bg-field px-3 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/30" />
        </div>
        <div>
          <Label htmlFor="my-book-sort" className="mb-2 text-xs font-normal text-muted-foreground">Sort</Label>
          <NativeSelect id="my-book-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="w-full [&_select]:h-11 [&_option]:bg-field [&_option]:text-foreground">
            <NativeSelectOption value="latest">Newest first</NativeSelectOption>
            <NativeSelectOption value="oldest">Oldest first</NativeSelectOption>
          </NativeSelect>
        </div>
        <Link href="/add-book" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          <Plus aria-hidden="true" className="size-4" /> Add book
        </Link>
      </div>
      {books.length === 0 ? children : sortedBooks.length === 0 ? (
        <p className="mt-10 rounded-xl bg-card p-8 text-center text-sm text-muted-foreground">No books match your search.</p>
      ) : (
        <section aria-label="Books you shared" className="surface-panel mt-10 rounded-xl p-4 sm:p-6">
          <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,0.8fr)_minmax(0,0.5fr)_9rem] gap-4 pb-4 text-xs uppercase tracking-wide text-muted-foreground md:grid">
            <span>Book / Author</span>
            <span>Category</span>
            <span>Copies</span>
            <span className="text-center">Actions</span>
          </div>
          <div className="divide-y divide-border">
            {sortedBooks.map((book) => <MyBookCard key={book._id} book={book} />)}
          </div>
        </section>
      )}
    </>
  );
};

export default MyBooks;
