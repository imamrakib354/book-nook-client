import { Suspense } from "react";

import { ProfileAvatar } from "@/components/profilePage/profile-menu";
import ProfileDialogBox from "@/components/profilePage/profileDialogBox";
import { requireSession } from "@/lib/require-session";
import type { IBook } from "@/lib/types/IBook";
import type { IBorrow } from "@/lib/types/IBorrow";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function AuthenticatedProfile() {
  const { user } = await requireSession();
  let books: IBook[] = [];
  let loadError = false;
  let borrowedCount: number | string = "—";
  let borrowLoadError = false;

  try {
    const response = await fetch(`${apiUrl}/my-books?email=${encodeURIComponent(user.email)}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to load your books.");
    books = (await response.json()) as IBook[];
    books = books.filter((book) => book.ownerEmail?.toLowerCase() === user.email.toLowerCase());
  } catch {
    loadError = true;
  }

  try {
    const response = await fetch(`${apiUrl}/my-borrows/${encodeURIComponent(user.email)}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to load borrowed books.");
    const borrows: IBorrow[] = await response.json();
    // eslint-disable-next-line react-hooks/purity -- Request-time snapshot in an async Server Component.
    const now = Date.now();
    borrowedCount = borrows.filter((borrow) => new Date(borrow.dueDate).getTime() > now).length;
  } catch {
    borrowLoadError = true;
  }

  const memberSince = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date(user.createdAt));
  
  const stats = [
    { label: "Shared books", value: loadError ? "—" : books.length },
    { label: "Books borrowed", value: borrowedCount },
    { label: "Available books", value: loadError ? "—" : books.filter((book) => Number(book.copies) > 0).length },
  ];

  return (
    <main className="flex-1 bg-[#0b191a] px-5 py-8 text-white sm:px-8 lg:px-10">
      
      <div className="mx-auto max-w-6xl">
        <h1 className="font-[family-name:var(--font-dm-serif)] text-3xl text-[#fffaf1] sm:text-4xl">Your reader profile</h1>
        <p className="mt-1 text-sm text-[#a7b8b8]">A space for your books, your borrowing history and account details.</p>
        <section aria-label="Reader profile" className="mt-8 rounded-xl bg-[#172b2c] p-6 sm:p-8">
          
          <div className="flex items-center gap-5 sm:gap-6">
            <ProfileAvatar name={user.name} image={user.image} size={80} />
            <div className="min-w-0">
              <h2 className="font-[family-name:var(--font-dm-serif)] text-2xl text-[#fffaf1]">{user.name}</h2>
              <p className="mt-1 text-sm text-[#a7b8b8]">Community book contributor</p>
              <p className="mt-1 text-xs text-[#eac58c]">Member since {memberSince}</p>
            </div>
          </div>

          <div aria-label="Your book statistics" className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5">
            {stats.map(({ label, value }) => (
              <div key={label} className="flex min-h-20 flex-col justify-center rounded-lg bg-[#223638] px-5 py-4">
                <span className="font-[family-name:var(--font-dm-serif)] text-2xl text-[#a9e9cd]">{value}</span>
                <span className="text-xs text-[#9badae]">{label}</span>
              </div>
            ))}
          </div>

          {(loadError || borrowLoadError) && <p role="alert" className="mt-3 text-sm text-[#f3b7a8]">Unable to load some book statistics. Please try again later.</p>}
          <ProfileDialogBox user={{ name: user.name, image: user.image }} />
        </section>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return <Suspense fallback={<main className="flex-1 bg-[#0b191a]" />}><AuthenticatedProfile /></Suspense>;
}
