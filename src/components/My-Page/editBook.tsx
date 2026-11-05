
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { BookOpen, Eye, Upload } from "lucide-react";
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
import { uploadImage } from "@/lib/upload-image";

const inputClass =
  "h-10 border-border bg-field px-3 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30";

const labelClass = "mb-2 text-xs font-normal text-muted-foreground";

const EditBook = ({ book }: { book: IBook }) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(book.coverUrl || "");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coverMethod, setCoverMethod] = useState<"upload" | "url">("url");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(book.coverUrl || "");
  const imageReader = useRef<FileReader | null>(null);

  useEffect(() => () => imageReader.current?.abort(), []);

  const changeCoverMethod = (method: "upload" | "url") => {
    imageReader.current?.abort();
    setCoverMethod(method);
    setImageFile(null);
    setImageUrl(book.coverUrl || "");
    setPreviewUrl(book.coverUrl || "");
  };

  const selectImage = (file?: File) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      toast.error("Choose a JPG, PNG or WebP image no larger than 5 MB.");
      return;
    }
    imageReader.current?.abort();
    const reader = new FileReader();
    imageReader.current = reader;
    reader.onload = () => setPreviewUrl(String(reader.result));
    reader.onerror = () => {
      setImageFile(null);
      setPreviewUrl(book.coverUrl || "");
      toast.error("Could not read this image. Choose another file.");
    };
    setImageFile(file);
    reader.readAsDataURL(file);
  };

  const previewCover = () => {
    try {
      const url = new URL(imageUrl.trim());
      if (!["https:", "http:"].includes(url.protocol)) throw new Error("Invalid URL");
      setPreviewUrl(url.href);
    } catch {
      toast.error("Enter a valid http or https image URL.");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const formData = new FormData(event.currentTarget);
    formData.delete("title");
    formData.delete("author");
    formData.delete("coverUrl");
    const updatedData = Object.fromEntries(formData.entries());

    setSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = await getTokenFromClient();
      let coverUrl = book.coverUrl;
      if (coverMethod === "upload" && imageFile) {
        setUploading(true);
        coverUrl = await uploadImage(imageFile);
        setUploading(false);
      } else if (coverMethod === "url") {
        const url = new URL(imageUrl.trim());
        if (!["https:", "http:"].includes(url.protocol)) throw new Error("Enter a valid http or https image URL.");
        coverUrl = url.href;
      }
      const response = await fetch(`${apiUrl}/books/${book._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...updatedData, coverUrl }),
      });

      const result = await response.json();
      if (!response.ok || !result.matchedCount) {
        toast.error("Failed to update book.");
        return;
      }
      toast.success("Book updated successfully!");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update book.");
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (submitting) return;
        setOpen(value);
        imageReader.current?.abort();
        if (value) changeCoverMethod("url");
      }}
    >
      <DialogTrigger className="h-9 rounded-lg bg-muted px-4 text-xs text-foreground hover:bg-accent">
        Edit
      </DialogTrigger>

      <DialogContent showCloseButton={!submitting} className="max-h-[90dvh] overflow-y-auto border border-border bg-card p-6 text-foreground sm:max-w-lg">
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
            <fieldset disabled={submitting} className="min-w-0 space-y-6">
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
              <p className="mb-3 text-sm font-medium text-foreground">Book cover</p>
              <div className="mb-4 flex flex-wrap gap-3">
                <Button type="button" aria-pressed={coverMethod === "upload"} onClick={() => changeCoverMethod("upload")} className={`h-10 px-4 ${coverMethod === "upload" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-foreground hover:bg-accent"}`}>
                  <Upload aria-hidden="true" className="size-4" /> Upload file
                </Button>
                <Button type="button" aria-pressed={coverMethod === "url"} onClick={() => changeCoverMethod("url")} className={`h-10 px-4 ${coverMethod === "url" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-foreground hover:bg-accent"}`}>
                  Paste image URL
                </Button>
              </div>
              {coverMethod === "upload" ? (
                <div className="rounded-xl border border-dashed border-border bg-muted/50 p-5">
                  <Label htmlFor={`cover-file-${book._id}`} className="mb-3 text-sm text-foreground">Choose a replacement cover</Label>
                  <Input id={`cover-file-${book._id}`} type="file" accept="image/jpeg,image/png,image/webp" aria-describedby={`cover-help-${book._id}`} className="h-auto py-2" onChange={(event) => {
                    selectImage(event.target.files?.[0]);
                    event.target.value = "";
                  }} />
                  {imageFile && <p className="mt-3 break-all text-xs text-primary">{imageFile.name}</p>}
                  <p id={`cover-help-${book._id}`} className="mt-3 text-xs text-muted-foreground">JPG, PNG or WebP · Up to 5 MB. Uploaded through ImgBB when you save. Leave empty to keep the current cover.</p>
                </div>
              ) : (
                <>
                  <Label htmlFor={`cover-${book._id}`} className={labelClass}>
                    Book cover image URL
                  </Label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      id={`cover-${book._id}`}
                      name="coverUrl"
                      type="url"
                      value={imageUrl}
                      onChange={(event) => setImageUrl(event.target.value)}
                      required
                      className={inputClass}
                      placeholder="https://example.com/cover.jpg"
                    />
                    <Button type="button" onClick={previewCover} className="h-10 bg-primary px-5 text-primary-foreground hover:bg-primary/90">
                      <Eye aria-hidden="true" className="size-4" /> Preview
                    </Button>
                  </div>
                </>
              )}

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
                      onError={() => {
                        setPreviewUrl("");
                        toast.error("Could not load this cover. Check the URL or choose another image.");
                      }}
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
                onClick={() => {
                  imageReader.current?.abort();
                  setOpen(false);
                }}
                className="h-10 bg-muted px-5 text-foreground hover:bg-accent"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={submitting}
                className="h-10 bg-primary px-5 text-primary-foreground hover:bg-primary/90"
              >
                {submitting && <Spinner />}
                {uploading ? "Uploading cover..." : submitting ? "Saving..." : "Save changes"}
              </Button>
            </div>
            </fieldset>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditBook;
