"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProfilePhotoInput, { type ProfilePhotoInputHandle } from "@/components/profile-photo-input";

const inputClass = "h-11 border-0 bg-[#223638] px-3 text-white placeholder:text-[#91a4a4] focus-visible:ring-[#a9e9cd]/30";

const ProfileDialogBox = ({ user }: { user: { name: string; image?: string | null } }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const photoRef = useRef<ProfilePhotoInputHandle>(null);
  const [error, setError] = useState("");

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isUpdating) return;
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    setError("");
    if (!name) {
      setError("Enter your name.");
      return;
    }

    setIsUpdating(true);
    try {
      const image = await photoRef.current!.getImage();
      const { error } = await authClient.updateUser({ name, image: image || null });
      if (error) {
        setError(error.message || "Unable to update your profile. Please try again.");
        return;
      }
      setOpen(false);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to update your profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (isUpdating) return;
      setOpen(value);
      if (value) {
        setError("");
      }
    }}>
      <DialogTrigger className="mt-9 inline-flex h-9 min-w-28 items-center justify-center rounded-md bg-[#a9e9cd] px-4 text-xs font-medium text-[#102625] hover:bg-[#c4f4dc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd]">Edit profile</DialogTrigger>
      
      <DialogContent showCloseButton={!isUpdating} className="max-h-[90dvh] overflow-y-auto border border-[#294344] bg-[#172b2c] p-6 text-[#d9e3e0] sm:max-w-lg">

        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-dm-serif)] text-2xl font-normal text-[#fffaf1]">Edit your profile</DialogTitle>
          <DialogDescription className="text-[#9badae]">Update your name and profile photo.</DialogDescription>
        </DialogHeader>
        {open && <form onSubmit={handleUpdate} aria-busy={isUpdating} className="mt-2 space-y-5">

          <div>
            <Label htmlFor="profile-name" className="mb-2 text-xs font-normal text-[#b7c6c5]">Name</Label>
            <Input id="profile-name" name="name" defaultValue={user.name} required disabled={isUpdating} className={inputClass} />
          </div>

          <ProfilePhotoInput ref={photoRef} initialUrl={user.image || ""} disabled={isUpdating} />

          {error && <p role="alert" className="text-sm text-[#f3b7a8]">{error}</p>}
          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" disabled={isUpdating} onClick={() => setOpen(false)} className="h-10 bg-[#223638] px-5 text-[#d9e3e0] hover:bg-[#30484a]">Cancel</Button>
            <Button type="submit" disabled={isUpdating} className="h-10 bg-[#a9e9cd] px-5 text-[#102625] hover:bg-[#c4f4dc]">{isUpdating && <Spinner />}{isUpdating ? "Saving..." : "Save changes"}</Button>
          </div>

        </form>}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialogBox;
