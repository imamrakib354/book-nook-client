import Link from "next/link";

import { Card } from "@/components/ui/card";

const steps = [
  {
    title: "Discover a book",
    description: "Browse All Books, filter by category or newest and oldest, or search by title or author.",
    links: [{ label: "Browse books", href: "/books" }],
  },
  {
    title: "Explore the details",
    description: "Open a book to see its details, loan length, and how many copies are available.",
  },
  {
    title: "Check availability",
    description: "You can borrow a book only if a copy is available. If none are left, try another book.",
  },
  {
    title: "Borrow & read",
    description: "Borrow an available copy for the days set by its owner. Find your borrowed book in My Borrows.",
    links: [{ label: "View my borrows", href: "/my-borrows" }],
  },
  {
    title: "Loan ends automatically",
    description: "When your borrowing period ends, the book is removed from My Borrows automatically.",
  },
  {
    title: "Share your books",
    description: "Add books with a loan length and copy limit. See how many you have shared in My Books.",
    links: [
      { label: "Add a book", href: "/add-book" },
      { label: "My books", href: "/my-books" },
    ],
  },
];

const HowBorrowingWorks = () => {
  return (
    <section id="how-borrowing-works" aria-labelledby="borrowing-heading" className="bg-[#0b191a] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <h2 id="borrowing-heading" className="font-[family-name:var(--font-dm-serif)] text-4xl text-[#fffaf1] sm:text-5xl">
          How borrowing works
        </h2>

        <ol className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="flex">
              <Card className="min-h-60 w-full gap-0 rounded-2xl bg-[#172b2c] p-6 text-white ring-0 transition-all duration-200 hover:-translate-y-1 hover:bg-[#203637] hover:ring-1 hover:ring-[#a9e9cd]/30 focus-within:ring-2 focus-within:ring-[#a9e9cd]">
                <div className="flex items-start gap-5">
                  <span className="font-[family-name:var(--font-dm-serif)] text-4xl leading-none text-[#eac58c]" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-[family-name:var(--font-dm-serif)] text-2xl leading-tight text-[#fffaf1]">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-7 text-sm leading-relaxed text-[#a7b8b8]">
                  {step.description}
                </p>
                {step.links && (
                  <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-5">
                    {step.links.map((link) => (
                      <Link key={link.href} href={link.href} className="text-sm font-medium text-[#a9e9cd] underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd]">
                        {link.label} <span aria-hidden="true">→</span>
                      </Link>
                    ))}
                  </div>
                )}
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowBorrowingWorks;