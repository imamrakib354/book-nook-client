"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { BookOpen, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

const inputClass = "h-11 border-0 bg-[#223638] px-3 text-white placeholder:text-[#91a4a4] focus-visible:border-[#a9e9cd] focus-visible:ring-[#a9e9cd]/30";

const labelClass = "mb-2 text-xs font-normal text-[#b7c6c5]";

const AddBookPage = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [coverError, setCoverError] = useState("");

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

 
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const destination = Object.fromEntries(formData.entries());
  console.log("Form data to be sent :", destination);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  const response = await fetch(`${apiUrl}/add-book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(destination),
  });

  const result = await response.json();
  console.log("Response from server:", result);

  if (response.ok) {
    (e.target as HTMLFormElement).reset();

    setImageUrl("");
    setPreviewUrl("");
    setCoverLoaded(false);
    setCoverError("");
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
          <form onSubmit={handleSubmit} className="space-y-8">
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
                  <NativeSelectOption value="Kids">Others</NativeSelectOption>
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

            <div>
              <Label htmlFor="cover-url" className="mb-3 text-sm font-normal text-[#e0ebe5]">Book cover image URL</Label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  id="cover-url"
                  name="coverUrl"
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setPreviewUrl("");
                    setCoverLoaded(false);
                    setCoverError("");
                  }}
                  placeholder="https://example.com/book-cover.jpg"
                  aria-invalid={Boolean(coverError)}
                  aria-describedby={coverError ? "cover-error" : undefined}
                  className={inputClass}
                />
                <Button type="button" onClick={previewCover} className="h-11 bg-[#a9e9cd] px-5 text-[#102625] hover:bg-[#c4f4dc]">
                  <Eye aria-hidden="true" className="size-4" /> Preview
                </Button>
              </div>
              {coverError && <p id="cover-error" role="alert" className="mt-2 text-sm text-[#f3b7a8]">{coverError}</p>}

              <div className="mt-4 rounded-xl bg-[#223638] p-5">
                <p className="text-xs tracking-wide text-[#a7b8b8]">COVER PREVIEW</p>
                <div className="flex min-h-56 flex-col items-center justify-center gap-3 text-center">
                  {previewUrl && (
                    <Image
                      src={previewUrl}
                      alt="Book cover preview"
                      width={140}
                      height={180}
                      unoptimized
                      onLoad={() => setCoverLoaded(true)}
                      onError={() => {
                        setPreviewUrl("");
                        setCoverLoaded(false);
                        setCoverError("Could not load this image. Check the URL and try again.");
                      }}
                      className={coverLoaded ? "max-h-44 w-auto max-w-full rounded object-contain" : "h-0 w-0 opacity-0"}
                    />
                  )}
                  {!coverLoaded && (
                    <>
                      <div className="flex h-40 w-28 flex-col items-center justify-center gap-3 rounded-md border-l-8 border-[#eac58c] bg-[#315c5d] font-[family-name:var(--font-dm-serif)] text-lg text-[#fffaf1]">
                        <BookOpen aria-hidden="true" className="size-6 text-[#a9e9cd]" />
                        <span className="leading-tight">YOUR<br />BOOK</span>
                      </div>
                      <p className="text-sm text-[#a7b8b8]">{previewUrl ? "Loading cover..." : "Your book cover appears here"}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="book-description" className={labelClass}>Short description</Label>
              <Textarea id="book-description" name="description" required rows={4} placeholder="Write a little about what makes this book worth reading..." className="min-h-28 border-0 bg-[#223638] px-3 py-3 text-white placeholder:text-[#91a4a4] focus-visible:border-[#a9e9cd] focus-visible:ring-[#a9e9cd]/30" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="owner-name" className={labelClass}>Your name</Label>
                <Input id="owner-name" name="ownerName" autoComplete="name" required placeholder="Your name" className={inputClass} />
              </div>

              <div>
                <Label htmlFor="owner-email" className={labelClass}>Your email</Label>
                <Input id="owner-email" name="ownerEmail" type="email" autoComplete="email" required placeholder="you@example.com" className={inputClass} />
              </div>
            </div>

            <div>
              <Button type="submit" className="h-11 w-full bg-[#a9e9cd] text-[#102625] hover:bg-[#c4f4dc]">
                Publish book <span aria-hidden="true">→</span>
              </Button>

            </div>

          </form>
        </Card>
      </div>
    </main>
  );
};

export default AddBookPage;
