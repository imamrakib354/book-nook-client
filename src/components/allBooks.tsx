"use client";

import { useState } from "react";
import BookCard from "@/components/bookCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import type { IBook } from "@/lib/types/IBook";

const labelClass = "mb-2 text-xs font-normal text-[#b7c6c5]";
const selectClass = "w-full [&_select]:h-11 [&_select]:border-0 [&_select]:bg-[#223638] [&_select]:px-3 [&_select]:text-white [&_svg]:text-[#b7c6c5] [&_option]:bg-[#223638] [&_option]:text-white";

const AllBooks = ({ books }: { books: IBook[] }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

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
      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]" role="group" aria-label="Browse controls">
        <div>
          <Label htmlFor="book-search" className={labelClass}>Search</Label>
          <Input id="book-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title or author..." className="h-11 border-0 bg-[#223638] px-3 text-white placeholder:text-[#91a4a4] focus-visible:border-[#a9e9cd] focus-visible:ring-[#a9e9cd]/30" />
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
        <p className="text-sm text-[#9badae]">Showing {sortedBooks.length} {sortedBooks.length === 1 ? "book" : "books"}</p>
        {sortedBooks.length === 0 ? (
          <p className="mt-6 rounded-xl bg-[#172b2c] p-8 text-center text-[#b7c6c5]">{books.length === 0 ? "No books have been added yet." : searchTerm ? "No books match your search in the selected category." : "No books found in this category."}</p>
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
