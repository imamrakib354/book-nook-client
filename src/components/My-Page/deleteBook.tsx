"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Spinner } from "@/components/ui/spinner";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DeleteBook = ({ id }: { id: string }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      const token = await getTokenFromClient();
      const response = await fetch(`${apiUrl}/books/${id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok || !result.deletedCount) {
        toast.error("Failed to delete book.");
        return;
      }
      toast.success("Book deleted successfully!");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to delete book.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(value) => {
      if (deleting) return;
      setOpen(value);
    }}>
      <AlertDialogTrigger className="h-9 rounded-lg bg-[#633238] px-4 text-xs text-[#fff0ee] hover:bg-[#7a3c45] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3b7a8]">
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent className="border border-border bg-card p-6 text-foreground data-[size=default]:max-w-[calc(100%-2rem)] data-[size=default]:sm:max-w-md">
        <AlertDialogHeader className="place-items-start text-left">
          <AlertDialogTitle className="font-[family-name:var(--font-dm-serif)] text-2xl font-normal text-foreground">
            Delete this book?
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-muted-foreground">
            This permanently removes the book from your library.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <p className="text-xs text-gold">This cannot be undone. Check for active borrowings before deletion.</p>
        <AlertDialogFooter className="m-0 mt-3 border-0 bg-transparent p-0">
          <AlertDialogCancel disabled={deleting} className="h-9 border-0 bg-muted px-5 text-xs text-foreground hover:bg-accent hover:text-foreground">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleting} className="h-9 bg-[#633238] px-5 text-xs text-[#fff0ee] hover:bg-[#7a3c45]">
            {deleting && <Spinner />}
            {deleting ? "Deleting..." : "Delete book"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBook;
