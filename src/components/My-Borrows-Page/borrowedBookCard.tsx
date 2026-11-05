"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { IBorrow } from "@/lib/types/IBorrow";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

const formatDate = (value: string) => new Date(value).toLocaleDateString("en-US", {
  month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
});

const BorrowedBookCard = ({ borrow }: { borrow: IBorrow }) => {
  const router = useRouter();
  const [returning, setReturning] = useState(false);
  const [returned, setReturned] = useState(false);
  const [error, setError] = useState("");

  const handleReturn = async () => {
    if (returning) return;
    setReturning(true);
    setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      const token = await getTokenFromClient();
      const response = await fetch(`${apiUrl}/borrows/${borrow._id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok || result.deletedCount !== 1) {
        throw new Error(result.message || "Unable to return this book. Please try again.");
      }
      setReturned(true);
      router.refresh();
    } catch (error) {
      setError(error instanceof TypeError ? "Cannot reach the book server. Please try again when the server is available." : error instanceof Error ? error.message : "Unable to return this book. Please try again.");
    } finally {
      setReturning(false);
    }
  };

  if (returned) return null;

  return (
    <div className="grid grid-cols-2 items-center gap-4 py-5 text-sm text-[#d9e3e0] md:grid-cols-[5rem_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_9rem] md:gap-6">
      <div className="flex h-24 w-16 items-center justify-center overflow-hidden rounded-md bg-[#315c5d]">
        {borrow.coverUrl ? <Image src={borrow.coverUrl} alt={`Cover of ${borrow.title}`} width={64} height={96} unoptimized className="h-full w-full object-contain" /> : <BookOpen aria-hidden="true" className="size-6 text-[#a9e9cd]" />}
      </div>
      <div className="min-w-0">
        <h2 className="wrap-anywhere font-[family-name:var(--font-dm-serif)] text-lg text-[#fffaf1]">
          <Link href={`/all-books/${encodeURIComponent(borrow.bookId)}`} className="rounded-sm hover:text-[#a9e9cd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd]">{borrow.title}</Link>
        </h2>
        <p className="mt-1 wrap-anywhere text-sm text-[#9badae]">{borrow.author || "Author unavailable"}</p>
      </div>
      <p><span className="mb-1 block text-xs text-[#9badae] md:hidden">Borrow date</span>{formatDate(borrow.borrowDate)}</p>
      <p><span className="mb-1 block text-xs text-[#9badae] md:hidden">Return date</span>{formatDate(borrow.dueDate)}</p>
      <div className="col-span-2 min-w-0 md:col-span-1">
        <Button type="button" disabled={returning} onClick={handleReturn} className="h-11 w-full bg-[#a9e9cd] px-4 text-[#102625] hover:bg-[#c4f4dc]">
          {returning && <Spinner />}
          {returning ? "Returning..." : "Return Book"}
        </Button>
        {error && <p role="alert" className="mt-2 text-xs text-[#f3b7a8]">{error}</p>}
      </div>
    </div>
  );
};

export default BorrowedBookCard;
