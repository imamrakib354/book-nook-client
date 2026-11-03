
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type MouseEvent } from "react";
import { BookOpen, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
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

const inputClass =
  "h-10 border-0 bg-[#223638] px-3 text-white placeholder:text-[#91a4a4] focus-visible:ring-[#a9e9cd]/30";

const labelClass = "mb-2 text-xs font-normal text-[#b7c6c5]";

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

    const formData = new FormData(event.currentTarget);
    formData.delete("title");
    formData.delete("author");
    const updatedData = Object.fromEntries(formData.entries());

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

    setSubmitting(true);

    try {
      const response = await fetch(`${apiUrl}/all-books/${book._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();
      console.log("Update response:", result);

      if (response.ok && result.matchedCount > 0) {
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Book update failed:", error);
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
      <DialogTrigger className="h-9 rounded-lg bg-[#223638] px-4 text-xs text-[#d2dddb] hover:bg-[#30484a]">
        Edit
      </DialogTrigger>

      <DialogContent className="max-h-[90dvh] overflow-y-auto border border-[#294344] bg-[#172b2c] p-6 text-[#d9e3e0] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-dm-serif)] text-2xl font-normal text-[#fffaf1]">
            Edit book details
          </DialogTitle>

          <DialogDescription className="text-[#9badae]">
            Update the information for your shared book.
          </DialogDescription>
        </DialogHeader>

        {open && (
          <form onSubmit={handleSubmit} className="mt-2 space-y-6">
            <p id={`identity-note-${book._id}`} className="text-sm text-[#a7b8b8]">Title and author cannot be updated.</p>
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

              <div className="mt-4 rounded-xl bg-[#223638] p-4">
                <p className="mb-4 text-xs text-[#a7b8b8]">
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
                    <BookOpen className="size-10 text-[#a9e9cd]" />
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
                  className="w-full [&_select]:h-10 [&_select]:border-0 [&_select]:bg-[#223638] [&_select]:text-white"
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
                className="h-10 bg-[#223638] px-5 text-[#d9e3e0] hover:bg-[#30484a]"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={submitting}
                className="h-10 bg-[#a9e9cd] px-5 text-[#102625] hover:bg-[#c4f4dc]"
              >
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
