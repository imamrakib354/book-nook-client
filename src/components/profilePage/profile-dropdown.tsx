"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, UserRound } from "lucide-react";

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
    const { error } = await authClient.signOut();

    if (error) {
      console.log(error);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-[#223638]">
        <ProfileAvatar name={name} image={image} />

        <span className="hidden max-w-28 truncate text-sm font-medium text-[#e0ebe5] sm:inline">
          {name}
        </span>

        <ChevronDown className="size-4 text-[#a9e9cd]" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 border border-[#315051] bg-[#172b2c] p-2 text-white shadow-xl shadow-black/30"
      >
        <div className="px-3 py-3">
          <p className="truncate text-sm font-semibold text-[#fffaf1]">
            {name}
          </p>

          <p className="mt-1 truncate text-xs text-[#9badae]">
            {email}
          </p>
        </div>

        <DropdownMenuSeparator className="bg-[#315051]" />

        <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="cursor-pointer px-3 py-2 text-[#e0ebe5] focus:bg-[#294445] focus:text-[#e0ebe5] data-[highlighted]:bg-[#294445]"
        >
          <UserRound className="size-4" />
          My Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer px-3 py-2 text-[#f3b7a8] focus:bg-[#493135] focus:text-[#f3b7a8] data-[highlighted]:bg-[#493135]"
        >
          <LogOut className="size-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
