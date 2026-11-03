"use client";

import Image from "next/image";
import { useState, type FormEvent, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const inputClass = "h-11 border-0 bg-[#223638] px-3 text-white placeholder:text-[#91a4a4] focus-visible:ring-[#a9e9cd]/30";

const ProfileDialogBox = ({ user }: { user: { name: string; image?: string | null } }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(user.image || "");
  const [error, setError] = useState("");

  const previewPhoto = (event: MouseEvent<HTMLButtonElement>) => {
    const form = event.currentTarget.form;
    if (!form) return;
    const image = String(new FormData(form).get("image") || "").trim();
    setError("");
    try {
      if (image && !["http:", "https:"].includes(new URL(image).protocol)) throw new Error("Invalid photo URL");
    } catch {
      setError("Enter a valid http or https photo URL.");
      return;
    }
    setPreviewUrl(image);
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isUpdating) return;
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const image = String(formData.get("image") || "").trim();
    setError("");
    if (!name) {
      setError("Enter your name.");
      return;
    }
    if (image && !/^https?:\/\//i.test(image)) {
      setError("Enter a valid http or https photo URL.");
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await authClient.updateUser({ name, image: image || null });
      if (error) {
        setError(error.message || "Unable to update your profile. Please try again.");
        return;
      }
      setOpen(false);
      router.refresh();
    } catch {
      setError("Unable to update your profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (isUpdating) return;
      setOpen(value);
      if (value) {
        setPreviewUrl(user.image || "");
        setError("");
      }
    }}>
      <DialogTrigger className="mt-9 inline-flex h-9 min-w-28 items-center justify-center rounded-md bg-[#a9e9cd] px-4 text-xs font-medium text-[#102625] hover:bg-[#c4f4dc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd]">Edit profile</DialogTrigger>
      
      <DialogContent showCloseButton={!isUpdating} className="max-h-[90dvh] overflow-y-auto border border-[#294344] bg-[#172b2c] p-6 text-[#d9e3e0] sm:max-w-lg">

        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-dm-serif)] text-2xl font-normal text-[#fffaf1]">Edit your profile</DialogTitle>
          <DialogDescription className="text-[#9badae]">Update your name and profile photo.</DialogDescription>
        </DialogHeader>
        {open && <form onSubmit={handleUpdate} className="mt-2 space-y-5">

          <div>
            <Label htmlFor="profile-name" className="mb-2 text-xs font-normal text-[#b7c6c5]">Name</Label>
            <Input id="profile-name" name="name" defaultValue={user.name} required disabled={isUpdating} className={inputClass} />
          </div>

          <div>
            <Label htmlFor="profile-photo" className="mb-2 text-xs font-normal text-[#b7c6c5]">Profile photo URL</Label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Input id="profile-photo" name="image" type="url" defaultValue={user.image || ""} placeholder="https://example.com/photo.jpg" disabled={isUpdating} className={inputClass} />
              <Button type="button" onClick={previewPhoto} disabled={isUpdating} className="h-11 bg-[#a9e9cd] px-5 text-[#102625] hover:bg-[#c4f4dc]"><Eye aria-hidden="true" className="size-4" /> Preview</Button>
            </div>

            <p className="mt-2 text-xs text-[#9badae]">Leave blank to use your initial instead of a photo.</p>
          </div>

          <div className="rounded-xl bg-[#223638] p-5">
            <p className="mb-4 text-xs text-[#a7b8b8]">PHOTO PREVIEW</p>
            <div className="mx-auto flex size-28 items-center justify-center overflow-hidden rounded-full bg-[#315c5d]">
              {previewUrl ? <Image key={previewUrl} src={previewUrl} alt="Profile photo preview" width={112} height={112} unoptimized className="h-full w-full object-cover" onError={() => {
                setPreviewUrl("");
                setError("Could not load this photo. Check the URL and try again.");
              }} /> : <UserRound aria-hidden="true" className="size-10 text-[#a9e9cd]" />}
            </div>
          </div>

          {error && <p role="alert" className="text-sm text-[#f3b7a8]">{error}</p>}
          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" disabled={isUpdating} onClick={() => setOpen(false)} className="h-10 bg-[#223638] px-5 text-[#d9e3e0] hover:bg-[#30484a]">Cancel</Button>
            <Button type="submit" disabled={isUpdating} className="h-10 bg-[#a9e9cd] px-5 text-[#102625] hover:bg-[#c4f4dc]">{isUpdating ? "Saving..." : "Save changes"}</Button>
          </div>

        </form>}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialogBox;
