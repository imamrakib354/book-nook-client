"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      const token = await getTokenFromClient();
      const response = await fetch(`${apiUrl}/books/${id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (response.ok && result.deletedCount > 0) {
        setOpen(false);
        router.refresh();
      } else {
        setError("Unable to delete this book. Please try again.");
      }
    } catch {
      setError("Unable to delete this book. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(value) => {
      if (deleting) return;
      setOpen(value);
      setError("");
    }}>
      <AlertDialogTrigger className="h-9 rounded-lg bg-[#633238] px-4 text-xs text-[#fff0ee] hover:bg-[#7a3c45] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3b7a8]">
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent className="border border-[#294344] bg-[#172b2c] p-6 text-[#d9e3e0] data-[size=default]:max-w-[calc(100%-2rem)] data-[size=default]:sm:max-w-md">
        <AlertDialogHeader className="place-items-start text-left">
          <AlertDialogTitle className="font-[family-name:var(--font-dm-serif)] text-2xl font-normal text-[#fffaf1]">
            Delete this book?
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-[#9badae]">
            This permanently removes the book from your library.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <p className="text-xs text-[#eac58c]">This cannot be undone. Check for active borrowings before deletion.</p>
        {error && <p role="alert" className="text-sm text-[#f3b7a8]">{error}</p>}
        <AlertDialogFooter className="m-0 mt-3 border-0 bg-transparent p-0">
          <AlertDialogCancel disabled={deleting} className="h-9 border-0 bg-[#223638] px-5 text-xs text-[#d9e3e0] hover:bg-[#30484a] hover:text-white">
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
