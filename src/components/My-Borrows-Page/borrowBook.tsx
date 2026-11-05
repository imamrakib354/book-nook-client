"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IBook } from "@/lib/types/IBook";
import type { IBorrow } from "@/lib/types/IBorrow";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

const BorrowBook = ({ book, user }: { book: IBook; user: { name: string; email: string } }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const checkBorrowed = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = await getTokenFromClient();
    const response = await fetch(`${apiUrl}/borrows`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || "Unable to check your borrowed books. Please try again.");
    }
    const borrows: IBorrow[] = await response.json();
    return borrows.some((borrow) => borrow.bookId === book._id);
  };

  const handleBorrow = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      if (await checkBorrowed()) {
        toast.error("You have already borrowed this book. Return it before borrowing it again.");
        return;
      }
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = await getTokenFromClient();
      const response = await fetch(`${apiUrl}/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId: book._id }),
      });
      const result = await response.json();
      if (!response.ok || !result.insertedId) {
        toast.error(result.message || "Failed to borrow book.");
        return;
      }
      toast.success("Book borrowed successfully!");
      setOpen(false);
      router.push("/my-borrows");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to borrow book. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (submitting) return;
      setOpen(value);
    }}>
      <DialogTrigger disabled={Number(book.copies) < 1} className="h-11 min-w-44 rounded-lg bg-[#a9e9cd] px-5 text-sm font-medium text-[#102625] hover:bg-[#c4f4dc] disabled:cursor-not-allowed disabled:opacity-60">
        {Number(book.copies) < 1 ? "Not Available" : "Borrow this book"} <span aria-hidden="true">→</span>
      </DialogTrigger>
      <DialogContent showCloseButton={!submitting} className="border border-border bg-card p-6 text-foreground sm:max-w-xl sm:p-8">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-dm-serif)] text-3xl font-normal text-foreground">Borrow this book</DialogTitle>
          <DialogDescription className="mt-2 text-muted-foreground">Keep this book for {book.borrowDays} days. Return it to the community when finished.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleBorrow} className="mt-4 space-y-5">
          <div>
            <Label htmlFor={`borrow-name-${book._id}`} className="mb-2 text-xs font-normal text-muted-foreground">User Name</Label>
            <Input id={`borrow-name-${book._id}`} value={user.name} readOnly className="h-11 border-0 bg-muted px-3 text-foreground" />
          </div>
          <div>
            <Label htmlFor={`borrow-email-${book._id}`} className="mb-2 text-xs font-normal text-muted-foreground">User Email</Label>
            <Input id={`borrow-email-${book._id}`} type="email" value={user.email} readOnly className="h-11 border-0 bg-muted px-3 text-foreground" />
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" disabled={submitting} onClick={() => setOpen(false)} className="h-11 bg-muted px-6 text-foreground hover:bg-accent">Cancel</Button>
            <Button type="submit" disabled={submitting} className="h-11 bg-[#a9e9cd] px-6 text-[#102625] hover:bg-[#c4f4dc] disabled:pointer-events-auto disabled:cursor-not-allowed">
              {submitting && <Spinner />}
              {submitting ? "Borrowing..." : "Confirm borrow"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowBook;
