"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IBorrow } from "@/lib/types/IBorrow";

const formatDate = (value: string) => new Date(value).toLocaleDateString("en-US", {
  month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
});

const BorrowedBookCard = ({ borrow, daysLeft }: { borrow: IBorrow; daysLeft: number }) => {
  const router = useRouter();
  const [returning, setReturning] = useState(false);
  const [error, setError] = useState("");

  const handleReturn = async () => {
    if (returning) return;
    setReturning(true);
    setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      const response = await fetch(`${apiUrl}/my-borrows/${borrow._id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (response.status !== 404 && (!response.ok || result.deletedCount !== 1)) {
        throw new Error("Return failed");
      }
      router.refresh();
    } catch {
      setError("Unable to return this book. Please try again.");
    } finally {
      setReturning(false);
    }
  };

  return (
    <div className="grid gap-4 py-5 text-sm text-[#d9e3e0] md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center md:gap-6">
      <div className="flex min-w-0 items-center gap-5">
        <div className="flex h-24 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#315c5d]">
          {borrow.coverUrl ? <Image src={borrow.coverUrl} alt={`Cover of ${borrow.title}`} width={64} height={96} unoptimized className="h-full w-full object-contain" /> : <BookOpen aria-hidden="true" className="size-6 text-[#a9e9cd]" />}
        </div>
        <Link href={`/all-books/${borrow.bookId}`} className="font-[family-name:var(--font-dm-serif)] text-lg text-[#fffaf1] hover:text-[#a9e9cd] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-[#a9e9cd]">{borrow.title}</Link>
      </div>
      <p><span className="text-[#9badae] md:hidden">Borrow date: </span>{formatDate(borrow.borrowDate)}</p>
      <div>
        <p><span className="text-[#9badae] md:hidden">Due date: </span>{formatDate(borrow.dueDate)}</p>
        <p className={`mt-2 ${daysLeft <= 3 ? "text-[#eac58c]" : "text-[#a9e9cd]"}`}>{daysLeft} {daysLeft === 1 ? "day" : "days"} left</p>
      </div>
      <div>
        <Button type="button" disabled={returning} onClick={handleReturn} className="h-11 bg-[#223638] px-6 text-[#d9e3e0] hover:bg-[#30484a]">{returning ? "Returning..." : "Return book"}</Button>
        {error && <p role="alert" className="mt-2 max-w-48 text-xs text-[#f3b7a8]">{error}</p>}
      </div>
    </div>
  );
};

export default BorrowedBookCard;
