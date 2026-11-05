"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { toast } from "react-toastify";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { authClient } from "@/lib/auth-client";
import { ProfileAvatar } from "@/components/profilePage/profile-menu";

export default function ProfileDropdown({
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image?: string | null;
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error(error.message || "Failed to sign out.");
        return;
      }
      toast.success("Signed out successfully!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to sign out.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Open profile menu" className="flex items-center rounded-lg p-0.5 hover:bg-muted lg:gap-2 lg:px-2 lg:py-1">
        <ProfileAvatar name={name} image={image} />

        <span className="hidden max-w-28 truncate text-sm font-medium text-foreground lg:inline">
          {name}
        </span>

        <ChevronDown aria-hidden="true" className="hidden size-4 text-primary lg:block" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 border border-border bg-card p-2 text-foreground shadow-xl shadow-black/15"
      >
        <div className="px-3 py-3">
          <p className="truncate text-sm font-semibold text-foreground">
            {name}
          </p>

          <p className="mt-1 truncate text-xs text-muted-foreground">
            {email}
          </p>
        </div>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="cursor-pointer px-3 py-2 text-foreground focus:bg-accent focus:text-foreground data-[highlighted]:bg-accent"
        >
          <UserRound className="size-4" />
          My Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer px-3 py-2 text-red-700 focus:bg-red-100 focus:text-red-700 data-[highlighted]:bg-red-100 dark:text-[#f3b7a8] dark:focus:bg-[#493135] dark:focus:text-[#f3b7a8] dark:data-[highlighted]:bg-[#493135]"
        >
          <LogOut className="size-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
