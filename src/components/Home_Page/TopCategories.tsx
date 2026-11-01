import Link from "next/link";
import { Atom, Landmark, Sparkles, Sun } from "lucide-react";

import { Card } from "@/components/ui/card";

const categories = [
  { name: "Fiction", description: "Stories that stay with you", icon: Sparkles },
  { name: "Science", description: "Explore how our world works", icon: Atom },
  { name: "History", description: "Discover worlds of the past", icon: Landmark },
  { name: "Kids", description: "Little readers, big adventures", icon: Sun },
];

const TopCategories = () => {
  return (
    <section aria-labelledby="categories-heading" className="bg-[#0b191a] px-5 pt-4 pb-16 sm:px-8 sm:pt-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <h2 id="categories-heading" className="font-[family-name:var(--font-dm-serif)] text-3xl text-[#fffaf1] sm:text-4xl">
          Explore by category
        </h2>
        <p className="mt-1 text-sm text-[#a7b8b8]">
          Find your next favorite story by browsing a shelf you love.
        </p>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ name, description, icon: Icon }) => (
            <Card key={name} className="gap-0 rounded-xl bg-[#172b2c] p-0 text-white ring-0 transition-all duration-200 hover:-translate-y-1 hover:bg-[#203637] hover:ring-1 hover:ring-[#a9e9cd]/30 focus-within:ring-2 focus-within:ring-[#a9e9cd]">
              <Link href="/all-books" className="flex h-full min-h-36 flex-col p-5 focus-visible:outline-none" aria-label={`Browse ${name} books`}>
                <span className="flex size-10 items-center justify-center rounded-full bg-[#2d554a] text-[#b3e9d0]">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="mt-3 font-[family-name:var(--font-dm-serif)] text-xl text-[#fffaf1]">
                  {name}
                </h3>
                <p className="mt-1 text-xs text-[#a7b8b8]">{description}</p>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCategories;
