"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import BorrowedBookCard from "./borrowedBookCard";
import type { IBorrow } from "@/lib/types/IBorrow";

const MyBorrows = ({ borrows, now }: { borrows: IBorrow[]; now: number }) => {

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const daysLeft = (borrow: IBorrow) => Math.ceil((new Date(borrow.dueDate).getTime() - now) / 86400000);

  const active = borrows.filter((borrow) => daysLeft(borrow) > 0)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const dueSoon = active.filter((borrow) => daysLeft(borrow) <= 3).length;

  const closest = active[0];

  const searchTerm = search.trim().toLowerCase();
  
  const filteredBorrows = active.filter((borrow) =>
    `${borrow.title} ${borrow.author ?? ""}`.toLowerCase().includes(searchTerm)
  );
  const sortedBorrows = [...filteredBorrows].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime();
    }

    if (sortBy === "oldest") {
      return new Date(a.borrowDate).getTime() - new Date(b.borrowDate).getTime();
    }

    return 0;
  });

  return (
    <>
      <section aria-label="Borrowing statistics" className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="flex min-h-28 items-center gap-6 rounded-xl bg-[#172b2c] p-6">
          <span className="font-[family-name:var(--font-dm-serif)] text-4xl text-[#a9e9cd]">{active.length}</span>
          <p className="text-sm text-[#9badae]">Currently reading</p>
        </div>
        <div className="flex min-h-28 items-center gap-6 rounded-xl bg-[#172b2c] p-6">
          <span className="font-[family-name:var(--font-dm-serif)] text-4xl text-[#a9e9cd]">{dueSoon}</span>
          <p className="text-sm text-[#9badae]">Due soon</p>
        </div>
        <div className="flex min-h-28 items-center gap-6 rounded-xl bg-[#172b2c] p-6">
          <span className="font-[family-name:var(--font-dm-serif)] text-4xl text-[#a9e9cd]">{closest ? daysLeft(closest) : "—"}</span>
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-dm-serif)] text-lg text-[#fffaf1]">Closest return</p>
            <p className="mt-1 text-sm text-[#a9e9cd]">{closest ? `${closest.title} · ${daysLeft(closest)} ${daysLeft(closest) === 1 ? "day" : "days"} left` : "No upcoming returns"}</p>
          </div>
        </div>
      </section>

      <div className="mt-9 grid items-end gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(10rem,0.4fr)_auto]">
        <div>
          <Label htmlFor="my-borrow-search" className="mb-2 text-xs font-normal text-[#b7c6c5]">Search my borrows</Label>
          <Input id="my-borrow-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title or author..." className="h-11 border-0 bg-[#223638] px-3 text-white placeholder:text-[#91a4a4] focus-visible:border-[#a9e9cd] focus-visible:ring-[#a9e9cd]/30" />
        </div>
        <div>
          <Label htmlFor="my-borrow-sort" className="mb-2 text-xs font-normal text-[#b7c6c5]">Sort</Label>
          <NativeSelect id="my-borrow-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="w-full [&_select]:h-11 [&_select]:border-0 [&_select]:bg-[#223638] [&_select]:px-3 [&_select]:text-white [&_svg]:text-[#b7c6c5] [&_option]:bg-[#223638] [&_option]:text-white">
            <NativeSelectOption value="latest">Newest first</NativeSelectOption>
            <NativeSelectOption value="oldest">Oldest first</NativeSelectOption>
          </NativeSelect>
        </div>
        <Link href="/all-books" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#a9e9cd] px-6 text-sm font-medium text-[#102625] hover:bg-[#c4f4dc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd]">
          <Plus aria-hidden="true" className="size-4" /> Borrow books
        </Link>
      </div>

      {active.length > 0 ? sortedBorrows.length === 0 ? (
        <p className="mt-10 rounded-xl bg-[#172b2c] p-8 text-center text-sm text-[#b7c6c5]">No borrowed books match your search.</p>
      ) : (
        <section aria-label="Your borrowed books" className="mt-10 rounded-xl bg-[#172b2c] p-5 sm:p-7">
          <div className="hidden grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_10rem] gap-6 pb-3 text-xs uppercase text-[#9badae] md:grid">
            <span>Book</span><span>Borrow date</span><span>Due date</span><span className="text-center">Action</span>
          </div>
          <div className="divide-y divide-white/5">
            {sortedBorrows.map((borrow) => <BorrowedBookCard key={borrow._id} borrow={borrow} daysLeft={daysLeft(borrow)} />)}
          </div>
        </section>
      ) : (
        <div className="mt-10 rounded-xl bg-[#172b2c] p-10 text-center">
          <h2 className="font-[family-name:var(--font-dm-serif)] text-2xl text-[#fffaf1]">No borrowed books yet</h2>
          <p className="mt-3 text-sm text-[#9badae]">Find your next story in the community library.</p>
          <Link href="/all-books" className="mt-5 inline-flex h-11 items-center rounded-lg bg-[#a9e9cd] px-6 text-sm text-[#102625] hover:bg-[#c4f4dc]">Browse books</Link>
        </div>
      )}
    </>
  );
};

export default MyBorrows;
