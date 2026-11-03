"use client";

import Image from "next/image";
import { useState } from "react";

export function ProfileAvatar({ name, image, size = 36 }: { name: string; image?: string | null; size?: number }) {
  const [brokenImage, setBrokenImage] = useState<string | null>(null);
  let validImage = false;
  try {
    validImage = Boolean(image && ["http:", "https:"].includes(new URL(image).protocol));
  } catch {
    validImage = false;
  }

  return (
    <span className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eac58c] font-semibold text-[#102625]" style={{ width: size, height: size }}>
      {validImage && brokenImage !== image ? (
        <Image src={image!} alt="" width={size} height={size} unoptimized onError={() => setBrokenImage(image!)} className="h-full w-full object-cover" />
      ) : (name.trim().charAt(0).toUpperCase() || "?")}
    </span>
  );
}
