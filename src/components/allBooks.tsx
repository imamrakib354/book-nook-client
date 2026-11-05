"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BookCard from "@/components/bookCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import type { IBook } from "@/lib/types/IBook";

const labelClass = "mb-2 text-xs font-normal text-muted-foreground";
const selectClass = "w-full [&_select]:h-11 [&_option]:bg-field [&_option]:text-foreground";

const AllBooks = ({ books }: { books: IBook[] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const category = ["Fiction", "Science", "History", "Kids", "Others"].find(
    (value) => value.toLowerCase() === requestedCategory?.toLowerCase()
  ) ?? "all";
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const setCategory = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const searchTerm = search.trim().toLowerCase();
  const filteredBooks = books.filter((book) =>
    (category === "all" || book.category === category) &&
    `${book.title} ${book.author}`.toLowerCase().includes(searchTerm)
  );
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    // MongoDB ObjectIds include creation time, so they also order books by age.
    if (sortBy === "latest") {
      return b._id.localeCompare(a._id);
    }

    if (sortBy === "oldest") {
      return a._id.localeCompare(b._id);
    }

    if (sortBy === "most-borrowed") {
      const difference = (b.borrowCount ?? 0) - (a.borrowCount ?? 0);
      return difference || b._id.localeCompare(a._id);
    }

    return 0;
  });

  return (
    <>
      <div className="filter-bar mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]" role="group" aria-label="Browse controls">
        <div>
          <Label htmlFor="book-search" className={labelClass}>Search</Label>
          <Input id="book-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title or author..." className="h-11 border-border bg-field px-3 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/30" />
        </div>
        <div>
          <Label htmlFor="book-category" className={labelClass}>Category</Label>
          <NativeSelect id="book-category" value={category} onChange={(event) => setCategory(event.target.value)} className={selectClass}>
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
          <NativeSelect id="book-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className={selectClass}>
            <NativeSelectOption value="latest">Newest first</NativeSelectOption>
            <NativeSelectOption value="oldest">Oldest first</NativeSelectOption>
            <NativeSelectOption value="most-borrowed">Most borrowed</NativeSelectOption>
          </NativeSelect>
        </div>
      </div>
      <section aria-label="Books" className="mt-10">
        <p className="text-sm text-muted-foreground">Showing {sortedBooks.length} {sortedBooks.length === 1 ? "book" : "books"}</p>
        {sortedBooks.length === 0 ? (
          <p className="mt-6 rounded-xl bg-card p-8 text-center text-muted-foreground">{books.length === 0 ? "No books have been added yet." : searchTerm ? "No books match your search in the selected category." : "No books found in this category."}</p>
        ) : (
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedBooks.map((book) => <BookCard key={book._id} book={book} />)}
          </div>
        )}
      </section>
    </>
  );
};

export default AllBooks;
