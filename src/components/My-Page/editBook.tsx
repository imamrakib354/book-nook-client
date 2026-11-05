
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type MouseEvent } from "react";
import { BookOpen, Eye } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import type { IBook } from "@/lib/types/IBook";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

const inputClass =
  "h-10 border-border bg-field px-3 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30";

const labelClass = "mb-2 text-xs font-normal text-muted-foreground";

const EditBook = ({ book }: { book: IBook }) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(book.coverUrl || "");
  const [submitting, setSubmitting] = useState(false);

  const previewCover = (event: MouseEvent<HTMLButtonElement>) => {
    const form = event.currentTarget.form;
    if (!form) return;

    const formData = new FormData(form);
    const url = String(formData.get("coverUrl") ?? "").trim();

    if (url.startsWith("https://") || url.startsWith("http://")) {
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const formData = new FormData(event.currentTarget);
    formData.delete("title");
    formData.delete("author");
    const updatedData = Object.fromEntries(formData.entries());

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

    setSubmitting(true);

    try {
      const token = await getTokenFromClient();
      const response = await fetch(`${apiUrl}/books/${book._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();
      if (!response.ok || !result.matchedCount) {
        toast.error("Failed to update book.");
        return;
      }
      toast.success("Book updated successfully!");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to update book.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (value) setPreviewUrl(book.coverUrl || "");
      }}
    >
      <DialogTrigger className="h-9 rounded-lg bg-muted px-4 text-xs text-foreground hover:bg-accent">
        Edit
      </DialogTrigger>

      <DialogContent className="max-h-[90dvh] overflow-y-auto border border-border bg-card p-6 text-foreground sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-dm-serif)] text-2xl font-normal text-foreground">
            Edit book details
          </DialogTitle>

          <DialogDescription className="text-muted-foreground">
            Update the information for your shared book.
          </DialogDescription>
        </DialogHeader>

        {open && (
          <form onSubmit={handleSubmit} className="mt-2 space-y-6">
            <p id={`identity-note-${book._id}`} className="text-sm text-muted-foreground">Title and author cannot be updated.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label
                  htmlFor={`title-${book._id}`}
                  className={labelClass}
                >
                  Book title
                </Label>
                <Input
                  id={`title-${book._id}`}
                  name="title"
                  defaultValue={book.title}
                  readOnly
                  aria-describedby={`identity-note-${book._id}`}
                  className={`${inputClass} cursor-not-allowed opacity-60`}
                />
              </div>

              <div>
                <Label
                  htmlFor={`author-${book._id}`}
                  className={labelClass}
                >
                  Author
                </Label>
                <Input
                  id={`author-${book._id}`}
                  name="author"
                  defaultValue={book.author}
                  readOnly
                  aria-describedby={`identity-note-${book._id}`}
                  className={`${inputClass} cursor-not-allowed opacity-60`}
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor={`cover-${book._id}`}
                className={labelClass}
              >
                Book cover image URL
              </Label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  id={`cover-${book._id}`}
                  name="coverUrl"
                  type="url"
                  defaultValue={book.coverUrl}
                  required
                  className={inputClass}
                  placeholder="https://example.com/cover.jpg"
                />

                <Button
                  type="button"
                  onClick={previewCover}
                  className="h-10 bg-[#a9e9cd] px-5 text-[#102625] hover:bg-[#c4f4dc]"
                >
                  <Eye className="size-4" />
                  Preview
                </Button>
              </div>

              <div className="mt-4 rounded-xl bg-muted p-4">
                <p className="mb-4 text-xs text-muted-foreground">
                  COVER PREVIEW
                </p>

                <div className="flex min-h-44 items-center justify-center">
                  {previewUrl ? (
                    <Image
                      key={previewUrl}
                      src={previewUrl}
                      alt="Book cover preview"
                      width={140}
                      height={180}
                      unoptimized
                      className="max-h-44 w-auto max-w-full rounded object-contain"
                      onError={() => setPreviewUrl("")}
                    />
                  ) : (
                    <BookOpen className="size-10 text-primary" />
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label
                  htmlFor={`category-${book._id}`}
                  className={labelClass}
                >
                  Category
                </Label>

                <NativeSelect
                  id={`category-${book._id}`}
                  name="category"
                  defaultValue={book.category}
                  required
                  className="w-full [&_select]:h-10"
                >
                  <NativeSelectOption value="Fiction">Fiction</NativeSelectOption>
                  <NativeSelectOption value="Science">Science</NativeSelectOption>
                  <NativeSelectOption value="History">History</NativeSelectOption>
                  <NativeSelectOption value="Kids">Kids</NativeSelectOption>
                  <NativeSelectOption value="Others">Others</NativeSelectOption>
                </NativeSelect>
              </div>

              <div>
                <Label
                  htmlFor={`copies-${book._id}`}
                  className={labelClass}
                >
                  Total copies
                </Label>
                <Input
                  id={`copies-${book._id}`}
                  name="copies"
                  type="number"
                  min="1"
                  defaultValue={book.copies}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <Label
                  htmlFor={`days-${book._id}`}
                  className={labelClass}
                >
                  Borrow duration (days)
                </Label>
                <Input
                  id={`days-${book._id}`}
                  name="borrowDays"
                  type="number"
                  min="1"
                  defaultValue={book.borrowDays}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button
                type="button"
                onClick={() => setOpen(false)}
                className="h-10 bg-muted px-5 text-foreground hover:bg-accent"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={submitting}
                className="h-10 bg-[#a9e9cd] px-5 text-[#102625] hover:bg-[#c4f4dc]"
              >
                {submitting && <Spinner />}
                {submitting ? "Saving..." : "Save changes"}
              </Button>
            </div>

          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditBook;
