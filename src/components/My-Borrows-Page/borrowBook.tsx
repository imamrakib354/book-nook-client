"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IBook } from "@/lib/types/IBook";
import type { IBorrow } from "@/lib/types/IBorrow";

const BorrowBook = ({ book, user }: { book: IBook; user: { name: string; email: string } }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [alreadyBorrowed, setAlreadyBorrowed] = useState(false);
  const [checking, setChecking] = useState(false);

  const checkBorrowed = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    const response = await fetch(`${apiUrl}/my-borrows/${encodeURIComponent(user.email)}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to check your borrowed books. Please try again.");
    const borrows: IBorrow[] = await response.json();
    const borrowed = borrows.some((borrow) => borrow.bookId === book._id);
    setAlreadyBorrowed(borrowed);
    return borrowed;
  };

  const handleBorrow = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting || checking || alreadyBorrowed) return;
    setSubmitting(true);
    setError("");

    try {
      if (await checkBorrowed()) return;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      const response = await fetch(`${apiUrl}/my-borrows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book._id, name: user.name, email: user.email }),
      });
      const result = await response.json();
      if (!response.ok || !result.insertedId) throw new Error(result.message || "Unable to borrow this book.");
      setAlreadyBorrowed(true);
      setOpen(false);
      router.push("/my-borrows");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to borrow this book. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={async (value) => {
      if (submitting) return;
      setOpen(value);
      setError("");
      if (value) {
        setChecking(true);
        try {
          await checkBorrowed();
        } catch (error) {
          setError(error instanceof Error ? error.message : "Unable to check your borrowed books.");
        } finally {
          setChecking(false);
        }
      }
    }}>
      <DialogTrigger disabled={Number(book.copies) < 1} className="h-11 min-w-44 rounded-lg bg-[#a9e9cd] px-5 text-sm font-medium text-[#102625] hover:bg-[#c4f4dc] disabled:cursor-not-allowed disabled:opacity-60">
        Borrow this book <span aria-hidden="true">→</span>
      </DialogTrigger>
      <DialogContent showCloseButton={!submitting} className="border border-[#294344] bg-[#172b2c] p-6 text-[#d9e3e0] sm:max-w-xl sm:p-8">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-dm-serif)] text-3xl font-normal text-[#fffaf1]">Borrow this book</DialogTitle>
          <DialogDescription className="mt-2 text-[#9badae]">Keep this book for {book.borrowDays} days. Return it to the community when finished.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleBorrow} className="mt-4 space-y-5">
          <div>
            <Label htmlFor={`borrow-name-${book._id}`} className="mb-2 text-xs font-normal text-[#b7c6c5]">User Name</Label>
            <Input id={`borrow-name-${book._id}`} value={user.name} readOnly className="h-11 border-0 bg-[#223638] px-3 text-white" />
          </div>
          <div>
            <Label htmlFor={`borrow-email-${book._id}`} className="mb-2 text-xs font-normal text-[#b7c6c5]">User Email</Label>
            <Input id={`borrow-email-${book._id}`} type="email" value={user.email} readOnly className="h-11 border-0 bg-[#223638] px-3 text-white" />
          </div>
          {error && <p role="alert" className="text-sm text-[#f3b7a8]">{error}</p>}
          {alreadyBorrowed && <p role="status" className="text-sm text-[#eac58c]">You have already borrowed this book. Return it before borrowing it again.</p>}
          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" disabled={submitting} onClick={() => setOpen(false)} className="h-11 bg-[#223638] px-6 text-[#d9e3e0] hover:bg-[#30484a]">Cancel</Button>
            <Button type="submit" disabled={submitting || checking || alreadyBorrowed} className="h-11 bg-[#a9e9cd] px-6 text-[#102625] hover:bg-[#c4f4dc] disabled:pointer-events-auto disabled:cursor-not-allowed">{checking ? "Checking..." : alreadyBorrowed ? "Already borrowed" : submitting ? "Borrowing..." : "Confirm borrow"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowBook;
