"use client";

import Image from "next/image";
import { useEffect, useId, useImperativeHandle, useRef, useState, type Ref } from "react";
import { Eye, Link2, Upload, UserRound, X } from "lucide-react";
import { toast } from "react-toastify";

import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { uploadImage } from "@/lib/upload-image";

export type ProfilePhotoInputHandle = { getImage: () => Promise<string> };

const validPhotoUrl = (value: string) => {
  if (value && !["http:", "https:"].includes(new URL(value).protocol)) throw new Error("Invalid URL");
  return value;
};

const ProfilePhotoInput = ({ ref, initialUrl = "", disabled = false }: {
  ref: Ref<ProfilePhotoInputHandle>;
  initialUrl?: string;
  disabled?: boolean;
}) => {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const readerRef = useRef<FileReader | null>(null);
  const [method, setMethod] = useState<"upload" | "url">(initialUrl ? "url" : "upload");
  const [imageUrl, setImageUrl] = useState(initialUrl);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialUrl);
  const [invalidFile, setInvalidFile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const busy = disabled || uploading;

  useEffect(() => {
    const form = containerRef.current?.closest("form");
    const reset = () => {
      readerRef.current?.abort();
      setMethod(initialUrl ? "url" : "upload");
      setImageUrl(initialUrl);
      setFile(null);
      setPreviewUrl(initialUrl);
      setInvalidFile(false);
    };
    form?.addEventListener("reset", reset);
    return () => {
      form?.removeEventListener("reset", reset);
      readerRef.current?.abort();
    };
  }, [initialUrl]);

  useImperativeHandle(ref, () => ({
    getImage: async () => {
      if (invalidFile) throw new Error("Choose a valid photo or remove it before continuing.");
      if (file) {
        setUploading(true);
        try {
          const url = await uploadImage(file);
          // Keep the uploaded URL if saving the account needs to be retried.
          setImageUrl(url);
          setFile(null);
          return url;
        } finally {
          setUploading(false);
        }
      }
      try {
        return validPhotoUrl(imageUrl.trim());
      } catch {
        throw new Error("Enter a valid http or https photo URL.");
      }
    },
  }));

  const clearPhoto = () => {
    readerRef.current?.abort();
    setFile(null);
    setImageUrl("");
    setPreviewUrl("");
    setInvalidFile(false);
  };

  const selectFile = (selected?: File) => {
    if (!selected || busy) return;
    clearPhoto();
    if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type) || selected.size > 5 * 1024 * 1024) {
      setInvalidFile(true);
      toast.error("Choose a JPG, PNG or WebP image no larger than 5 MB.");
      return;
    }
    const reader = new FileReader();
    readerRef.current = reader;
    setFile(selected);
    reader.onload = () => {
      setPreviewUrl(String(reader.result));
    };
    reader.onerror = () => {
      setFile(null);
      setInvalidFile(true);
      toast.error("Could not read this photo. Please choose it again.");
    };
    reader.readAsDataURL(selected);
  };

  const previewPhoto = () => {
    try {
      setPreviewUrl(validPhotoUrl(imageUrl.trim()));
    } catch {
      setPreviewUrl("");
      toast.error("Enter a valid http or https photo URL.");
    }
  };

  return (
    <div ref={containerRef} className="space-y-3">
      <p id={`${id}-label`} className="text-xs text-muted-foreground">Profile photo <span>(optional)</span></p>
      <fieldset disabled={busy} aria-labelledby={`${id}-label`} className="min-w-0 rounded-xl border border-border p-4 disabled:opacity-70">
        <div className="flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted ring-2 ring-primary/15">
            {previewUrl ? (
              <Image key={previewUrl} src={previewUrl} alt="Profile photo preview" width={64} height={64} unoptimized referrerPolicy="no-referrer" className="size-full object-cover" onError={() => {
                setPreviewUrl("");
                setInvalidFile(Boolean(file));
                toast.error("Could not load this photo. Try another image or check the URL.");
              }} />
            ) : <UserRound aria-hidden="true" className="size-7 text-primary" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-foreground">Make your nook feel like you</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Add a photo, or keep your initial.</p>
          </div>
          {(imageUrl || file || invalidFile) && <button type="button" onClick={clearPhoto} aria-label="Remove profile photo" className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-red-700 dark:hover:text-[#f3b7a8] focus-visible:outline-2 focus-visible:outline-primary"><X aria-hidden="true" className="size-4" /></button>}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-1 rounded-lg bg-background p-1">
          {(["upload", "url"] as const).map((option) => (
            <button key={option} type="button" aria-pressed={method === option} onClick={() => {
              if (method === option) return;
              clearPhoto();
              setMethod(option);
            }} className={`flex min-h-9 items-center justify-center gap-2 rounded-md px-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-primary ${method === option ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {option === "upload" ? <Upload aria-hidden="true" className="size-3.5" /> : <Link2 aria-hidden="true" className="size-3.5" />}
              {option === "upload" ? "Upload photo" : "Image URL"}
            </button>
          ))}
        </div>

        {method === "upload" ? (
          <div onDragOver={(event) => { event.preventDefault(); if (!busy) setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            selectFile(event.dataTransfer.files[0]);
          }} className={`mt-3 rounded-lg border border-dashed transition-colors focus-within:outline-2 focus-within:outline-primary ${dragging ? "border-primary bg-accent" : "border-border bg-muted/50 hover:border-primary/60"}`}>
            <input id={`${id}-file`} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-describedby={`${id}-help`} onChange={(event) => {
              selectFile(event.target.files?.[0]);
              event.target.value = "";
            }} />
            <label htmlFor={`${id}-file`} className={`flex min-h-24 flex-col items-center justify-center gap-2 px-3 py-4 text-center ${busy ? "cursor-wait" : "cursor-pointer"}`}>
              <span className="text-xs text-foreground">{dragging ? "Drop your photo here" : file ? "Choose a different photo" : imageUrl ? "Photo uploaded · Choose another" : <><span className="font-medium text-primary">Browse files</span> or drop a photo here</>}</span>
              <span id={`${id}-help`} className="text-[11px] text-muted-foreground">JPG, PNG or WebP · Up to 5 MB</span>
              {file && <span className="max-w-full truncate text-xs text-primary">{file.name}</span>}
            </label>
          </div>
        ) : (
          <div className="mt-3 flex min-w-0 gap-2">
            <Input aria-label="Profile photo URL" type="url" value={imageUrl} onChange={(event) => {
              setImageUrl(event.target.value);
              setPreviewUrl("");
            }} placeholder="https://example.com/photo.jpg" className="h-10 min-w-0 flex-1 border-border bg-field px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30" />
            <button type="button" onClick={previewPhoto} aria-label="Preview profile photo" className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-primary hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary"><Eye aria-hidden="true" className="size-4" /></button>
          </div>
        )}
        {uploading && <p role="status" className="mt-3 flex items-center gap-2 text-xs text-primary"><Spinner className="size-3.5" /> Uploading photo...</p>}
      </fieldset>
    </div>
  );
};

export default ProfilePhotoInput;
