"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { Eye, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

const inputClass = "h-11 border-0 bg-[#223638] px-3 text-white placeholder:text-[#91a4a4] focus-visible:border-[#a9e9cd] focus-visible:ring-[#a9e9cd]/30";

const labelClass = "mb-2 text-xs font-normal text-[#b7c6c5]";

const AddBookForm = ({ name, email }: { name: string; email: string }) => {
  const [coverMethod, setCoverMethod] = useState<"upload" | "url">("upload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [coverError, setCoverError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const imageReader = useRef<FileReader | null>(null);

  const changeCoverMethod = (method: "upload" | "url") => {
    if (method === coverMethod) return;
    imageReader.current?.abort();
    setCoverMethod(method);
    setImageFile(null);
    setImageUrl("");
    setPreviewUrl("");
    setCoverLoaded(false);
    setCoverError("");
  };

  const selectImage = (file?: File) => {
    if (!file || submitting) return;
    imageReader.current?.abort();
    setCoverError("");
    setImageFile(null);
    setPreviewUrl("");
    setCoverLoaded(false);

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setCoverError("Choose a JPG, PNG or WebP image no larger than 5 MB.");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    imageReader.current = reader;
    reader.onload = () => setPreviewUrl(String(reader.result));
    reader.onerror = () => {
      setImageFile(null);
      setCoverError("Could not read this image. Please choose it again.");
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) throw new Error("Image uploading is not configured. NEXT_PUBLIC_IMGBB_API_KEY is missing.");

    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (!response.ok || !result.success || !result.data?.url) {
      throw new Error(result.error?.message || "Image upload failed. Please try again.");
    }
    return result.data.url as string;
  };

  const previewCover = () => {
    setCoverError("");

    try {
      const url = new URL(imageUrl.trim());
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        throw new Error("Invalid image URL");
      }
      if (previewUrl === url.href && coverLoaded) return;
      setCoverLoaded(false);
      setPreviewUrl(url.href);
    } catch {
      setPreviewUrl("");
      setCoverLoaded(false);
      setCoverError("Enter a valid http or https image URL.");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitError("");
    if (coverMethod === "upload" && !imageFile) {
      setCoverError("Choose or drop a book cover image first.");
      return;
    }

    const form = event.currentTarget;
    const book = Object.fromEntries(new FormData(form).entries());
    setSubmitting(true);
    try {
      let coverUrl = imageUrl.trim();
      if (coverMethod === "upload" && imageFile) {
        setUploading(true);
        coverUrl = await uploadImage(imageFile);
        setUploading(false);
      }
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...book, coverUrl }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to publish your book. Please try again.");
      imageReader.current?.abort();
      form.reset();
      setImageFile(null);
      setImageUrl("");
      setPreviewUrl("");
      setCoverLoaded(false);
      setCoverError("");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to publish your book. Please try again.");
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-1 bg-[#0b191a] px-5 py-12 text-white sm:px-8 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-[family-name:var(--font-dm-serif)] text-3xl text-[#fffaf1] sm:text-4xl">
          Share a book with the community
        </h1>
        <p className="mt-1 text-sm text-[#a7b8b8]">Someone is waiting for the story on your shelf.</p>

        <Card className="mt-8 gap-0 rounded-2xl bg-[#172b2c] p-6 text-white ring-0 sm:p-10">
          <form onSubmit={handleSubmit} aria-busy={submitting}>
            <fieldset disabled={submitting} className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">

              <div>
                <Label htmlFor="book-title" className={labelClass}>Book title</Label>
                <Input id="book-title" name="title" required placeholder="e.g. The Alchemist" className={inputClass} />
              </div>

              <div>
                <Label htmlFor="book-author" className={labelClass}>Author name</Label>
                <Input id="book-author" name="author" required placeholder="e.g. Paulo Coelho" className={inputClass} />
              </div>

              <div>
                <Label htmlFor="book-category" className={labelClass}>Category</Label>
                <NativeSelect id="book-category" name="category" required className="w-full [&_select]:h-11 [&_select]:border-0 [&_select]:bg-[#223638] [&_select]:px-3 [&_select]:text-white [&_svg]:text-[#b7c6c5]">
                  <NativeSelectOption value="Fiction">Fiction</NativeSelectOption>
                  <NativeSelectOption value="Science">Science</NativeSelectOption>
                  <NativeSelectOption value="History">History</NativeSelectOption>
                  <NativeSelectOption value="Kids">Kids</NativeSelectOption>
                  <NativeSelectOption value="Others">Others</NativeSelectOption>
                </NativeSelect>
              </div>

              <div>
                <Label htmlFor="book-copies" className={labelClass}>Total copies</Label>
                <Input id="book-copies" name="copies" type="number" min="1" step="1" defaultValue="1" required className={inputClass} />
              </div>

              <div>
                <Label htmlFor="borrow-days" className={labelClass}>Borrow duration (days)</Label>
                <Input id="borrow-days" name="borrowDays" type="number" min="1" step="1" defaultValue="7" required className={inputClass} />
              </div>
            </div>

            <section aria-label="Book cover" className="rounded-xl border border-[#294344] p-5 sm:p-6">
              <p className="mb-3 text-sm text-[#e0ebe5]">Choose how to add your book cover</p>
              <div className="mb-5 flex flex-wrap gap-3">
                <Button type="button" aria-pressed={coverMethod === "upload"} onClick={() => changeCoverMethod("upload")} className={`h-10 px-6 ${coverMethod === "upload" ? "bg-[#a9e9cd] text-[#102625] hover:bg-[#c4f4dc]" : "bg-[#223638] text-[#d9e3e0] hover:bg-[#30484a]"}`}>Upload file</Button>
                <Button type="button" aria-pressed={coverMethod === "url"} onClick={() => changeCoverMethod("url")} className={`h-10 px-6 ${coverMethod === "url" ? "bg-[#a9e9cd] text-[#102625] hover:bg-[#c4f4dc]" : "bg-[#223638] text-[#d9e3e0] hover:bg-[#30484a]"}`}>Paste image URL</Button>
              </div>
              <div className="grid items-start gap-5 sm:grid-cols-[minmax(0,1fr)_13rem]">
                {coverMethod === "upload" ? (
                  <div
                    onDragOver={(event) => { event.preventDefault(); if (!submitting) setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(event) => {
                      event.preventDefault();
                      setIsDragging(false);
                      selectImage(event.dataTransfer.files[0]);
                    }}
                    className={`rounded-xl border-2 border-dashed transition-colors focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-[#a9e9cd] ${isDragging ? "border-[#a9e9cd] bg-[#294b45]" : "border-[#365051] bg-[#223638] hover:border-[#a9e9cd]/60"}`}
                  >
                    <input id="cover-file" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-describedby={coverError ? "cover-error" : "cover-help"} aria-invalid={Boolean(coverError)} onChange={(event) => {
                      selectImage(event.target.files?.[0]);
                      event.target.value = "";
                    }} />
                    <label htmlFor="cover-file" className={`flex min-h-56 flex-col items-center justify-center gap-4 px-5 py-7 text-center ${submitting ? "cursor-wait" : "cursor-pointer"}`}>
                      <Upload aria-hidden="true" className="size-8 text-[#a9e9cd]" />
                      <span className="text-sm text-[#e0ebe5]">{isDragging ? "Drop your book cover here" : "Drop an image here, or browse files"}</span>
                      <span className="text-xs text-[#9badae]">JPG, PNG or WebP · Maximum 5 MB</span>
                      {imageFile && <span className="max-w-full break-all text-xs text-[#a9e9cd]">{imageFile.name}</span>}
                    </label>
                  </div>
                ) : (
                  <div className="min-h-56 rounded-xl bg-[#223638] p-5">
                    <Label htmlFor="cover-url" className="mb-3 text-sm font-normal text-[#e0ebe5]">Paste your book cover image URL</Label>
                    <Input id="cover-url" name="coverUrl" type="url" required value={imageUrl} onChange={(event) => {
                      setImageUrl(event.target.value);
                      setPreviewUrl("");
                      setCoverLoaded(false);
                      setCoverError("");
                    }} placeholder="https://example.com/book-cover.jpg" aria-invalid={Boolean(coverError)} aria-describedby={coverError ? "cover-error" : "cover-help"} className="h-11 border-[#365051] bg-[#172b2c] px-3 text-white placeholder:text-[#91a4a4]" />
                    <Button type="button" onClick={previewCover} className="mt-4 h-11 bg-[#a9e9cd] px-5 text-[#102625] hover:bg-[#c4f4dc]">
                      <Eye aria-hidden="true" className="size-4" /> Preview
                    </Button>
                  </div>
                )}
                <div>
                  <div className="rounded-xl bg-[#223638] p-4">
                    <p className="text-xs tracking-wide text-[#a7b8b8]">COVER PREVIEW</p>
                    <div className="mt-3 flex min-h-40 flex-col items-center justify-center gap-3 text-center">
                      {previewUrl && (
                        <Image key={previewUrl} src={previewUrl} alt="Book cover preview" width={140} height={180} unoptimized loading="eager" onLoad={() => setCoverLoaded(true)} onError={() => {
                          setPreviewUrl("");
                          setCoverLoaded(false);
                          setImageFile(null);
                          setCoverError("Could not load this image. Choose another file or check the URL.");
                        }} className={coverLoaded ? "max-h-44 w-auto max-w-full rounded object-contain" : "h-0 w-0 opacity-0"} />
                      )}
                      {!coverLoaded && <div className="flex h-36 w-24 items-center justify-center rounded-md border-l-8 border-[#eac58c] bg-[#315c5d] px-3 text-left font-[family-name:var(--font-dm-serif)] text-lg text-[#fffaf1]">YOUR<br />BOOK</div>}
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[#9badae]">Selected cover appears here before publishing.</p>
                </div>
              </div>
              {coverError && <p id="cover-error" role="alert" className="mt-3 text-sm text-[#f3b7a8]">{coverError}</p>}
              <p id="cover-help" className="mt-5 text-xs text-[#eac58c]">Use either Upload File or Paste Image URL. Only the selected method is required.</p>
            </section>

            <div>
              <Label htmlFor="book-description" className={labelClass}>Short description</Label>
              <Textarea id="book-description" name="description" required rows={4} placeholder="Write a little about what makes this book worth reading..." className="min-h-28 border-0 bg-[#223638] px-3 py-3 text-white placeholder:text-[#91a4a4] focus-visible:border-[#a9e9cd] focus-visible:ring-[#a9e9cd]/30" />
            </div>

            <p className="text-sm text-[#a7b8b8]">Sharing as <span className="text-[#fffaf1]">{name}</span> ({email})</p>

            <div>
              {submitError && <p role="alert" className="mb-3 text-sm text-[#f3b7a8]">{submitError}</p>}
              <Button type="submit" disabled={submitting} className="h-11 w-full bg-[#a9e9cd] text-[#102625] hover:bg-[#c4f4dc]">
                {submitting && <Spinner />}
                {uploading ? "Uploading cover..." : submitting ? "Publishing..." : "Publish book"} <span aria-hidden="true">→</span>
              </Button>

            </div>

            </fieldset>
          </form>
        </Card>
      </div>
    </main>
  );
};

export default AddBookForm;
