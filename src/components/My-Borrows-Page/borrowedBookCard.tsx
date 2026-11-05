"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
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

  const handleReturn = async () => {
    if (returning) return;
    setReturning(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      const token = await getTokenFromClient();
      const response = await fetch(`${apiUrl}/borrows/${borrow._id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok || result.deletedCount !== 1) {
        toast.error(result.message || "Failed to return book.");
        return;
      }
      toast.success("Book returned successfully!");
      setReturned(true);
      router.refresh();
    } catch {
      toast.error("Failed to return book.");
    } finally {
      setReturning(false);
    }
  };

  if (returned) return null;

  return (
    <div className="grid grid-cols-2 items-center gap-4 py-5 text-sm text-foreground md:grid-cols-[5rem_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_9rem] md:gap-6">
      <div className="flex h-24 w-16 items-center justify-center overflow-hidden rounded-md bg-muted">
        {borrow.coverUrl ? <Image src={borrow.coverUrl} alt={`Cover of ${borrow.title}`} width={64} height={96} unoptimized className="h-full w-full object-contain" /> : <BookOpen aria-hidden="true" className="size-6 text-primary" />}
      </div>
      <div className="min-w-0">
        <h2 className="wrap-anywhere font-[family-name:var(--font-dm-serif)] text-lg text-foreground">
          <Link href={`/all-books/${encodeURIComponent(borrow.bookId)}`} className="rounded-sm hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{borrow.title}</Link>
        </h2>
        <p className="mt-1 wrap-anywhere text-sm text-muted-foreground">{borrow.author || "Author unavailable"}</p>
      </div>
      <p><span className="mb-1 block text-xs text-muted-foreground md:hidden">Borrow date</span>{formatDate(borrow.borrowDate)}</p>
      <p><span className="mb-1 block text-xs text-muted-foreground md:hidden">Return date</span>{formatDate(borrow.dueDate)}</p>
      <div className="col-span-2 min-w-0 md:col-span-1">
        <Button type="button" disabled={returning} onClick={handleReturn} className="h-11 w-full bg-[#a9e9cd] px-4 text-[#102625] hover:bg-[#c4f4dc]">
          {returning && <Spinner />}
          {returning ? "Returning..." : "Return Book"}
        </Button>
      </div>
    </div>
  );
};

export default BorrowedBookCard;
