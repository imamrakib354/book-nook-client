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
    <section aria-labelledby="categories-heading" className="bg-background px-5 pt-4 pb-16 sm:px-8 sm:pt-6 lg:px-10">
      <div className="site-container">
        <h2 id="categories-heading" className="font-[family-name:var(--font-dm-serif)] text-3xl text-foreground sm:text-4xl">
          Explore by category
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Find your next favorite story by browsing a shelf you love.
        </p>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ name, description, icon: Icon }) => (
            <Card key={name} className="gap-0 rounded-xl bg-card p-0 text-foreground ring-1 ring-border transition-all duration-200 hover:-translate-y-1 hover:bg-accent hover:ring-primary/30 focus-within:ring-2 focus-within:ring-primary">
              <Link href={{ pathname: "/all-books", query: { category: name } }} className="flex h-full min-h-36 flex-col p-5 focus-visible:outline-none" aria-label={`Browse ${name} books`}>
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="mt-3 font-[family-name:var(--font-dm-serif)] text-xl text-foreground">
                  {name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{description}</p>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCategories;
