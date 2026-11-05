"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen, Bookmark, UserRound } from "lucide-react";
import { toast } from "react-toastify";

import { Spinner } from "@/components/ui/spinner";
import type { IBook } from "@/lib/types/IBook";

const NewArrivals = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    const loadBooks = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
        const response = await fetch(`${apiUrl}/new-arrivals`, { cache: "no-store" });
        if (!active) return;
        if (!response.ok) {
          toast.error("Failed to load new arrivals.");
          setFailed(true);
          return;
        }
        const data = await response.json();
        if (active) setBooks(data.slice(0, 6));
      } catch {
        if (active) {
          toast.error("Unable to reach the book server.");
          setFailed(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadBooks();
    return () => { active = false; };
  }, []);

  const latest = books[0];

  return (
    <section aria-labelledby="arrivals-heading" className="bg-linear-to-b from-background via-chrome to-background px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
      <div className="site-container">
        <div className="mb-7">
          <p className="mb-3 flex items-center gap-3 text-xs font-medium tracking-[0.2em] text-primary">NEW ARRIVALS <span aria-hidden="true" className="h-px w-16 bg-gold" /></p>
          <h2 id="arrivals-heading" className="font-[family-name:var(--font-dm-serif)] text-4xl text-foreground sm:text-5xl">New chapters await.</h2>
          <p className="mt-3 text-sm text-muted-foreground">The latest additions to our shared library. Your next story starts here.</p>
        </div>

        {loading ? (
          <div role="status" className="flex min-h-64 items-center justify-center gap-3 text-sm text-primary"><Spinner className="size-6" /> Loading new arrivals...</div>
        ) : failed ? (
          <p className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">New arrivals are unavailable right now. Please try again later.</p>
        ) : !latest ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <BookOpen aria-hidden="true" className="mx-auto mb-3 size-8 text-primary" />
            <p className="text-sm text-muted-foreground">Our shelves are waiting for their first story. Check back soon!</p>
          </div>
        ) : (
          <>
            <article className="relative isolate overflow-hidden rounded-2xl border border-[#bda052]/40 bg-[#06352a]">
              <Image src="/images/first-arrivals.png" alt="" fill sizes="(max-width: 1280px) 100vw, 1280px" className="-z-20 object-cover" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-[#00251c]/50 via-[#00251c]/30 to-[#00251c]/65" />
              <div className="flex flex-col items-center gap-7 px-6 py-8 sm:flex-row sm:gap-10 sm:px-10 lg:px-20">
                <div className="flex h-56 w-40 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#172b2c] shadow-2xl shadow-black/50 sm:h-64 sm:w-44">
                  {latest.coverUrl ? <Image src={latest.coverUrl} alt={`Cover of ${latest.title}`} width={176} height={256} unoptimized className="h-full w-full object-contain" /> : <BookOpen aria-hidden="true" className="size-12 text-[#a9e9cd]" />}
                </div>
                <div className="min-w-0 max-w-xl text-center sm:text-left">
                  <p className="inline-flex items-center gap-2 rounded-md border border-[#a9e9cd]/50 bg-[#00251c]/70 px-3 py-2 text-[10px] font-semibold tracking-[0.15em] text-[#a9e9cd]"><Bookmark aria-hidden="true" className="size-3.5 text-[#eac58c]" /> THE LATEST ARRIVAL</p>
                  <h3 className="mt-4 wrap-anywhere font-[family-name:var(--font-dm-serif)] text-3xl text-[#fffaf1] sm:text-4xl">{latest.title}</h3>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#eac58c] sm:justify-start">
                    <p className="flex items-center gap-1.5"><UserRound aria-hidden="true" className="size-3.5" />{latest.author}</p>
                    <p className="flex items-center gap-1.5"><BookOpen aria-hidden="true" className="size-3.5" />{latest.category}</p>
                  </div>
                  <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-[#d1dfd5]">{latest.description}</p>
                  <Link href={`/all-books/${latest._id}`} className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#a9e9cd] px-5 text-sm font-medium text-[#102625] hover:bg-[#c4f4dc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd]">View Details <ArrowUpRight aria-hidden="true" className="size-4" /></Link>
                </div>
              </div>
            </article>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {books.slice(1).map((book) => (
                <article key={book._id} className="group flex h-full min-w-0 flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/60">
                  <div className="flex h-48 items-center justify-center overflow-hidden rounded-lg bg-muted">
                    {book.coverUrl ? <Image src={book.coverUrl} alt={`Cover of ${book.title}`} width={180} height={192} unoptimized className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" /> : <BookOpen aria-hidden="true" className="size-10 text-primary" />}
                  </div>
                  <div className="flex flex-1 flex-col pt-4">
                    <span className="self-start rounded border border-gold/50 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-gold">{book.category}</span>
                    <h3 className="mt-3 wrap-anywhere font-[family-name:var(--font-dm-serif)] text-xl leading-tight text-foreground">{book.title}</h3>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><UserRound aria-hidden="true" className="size-3 shrink-0 text-gold" />{book.author}</p>
                    <div className="mt-auto pt-5">
                      <Link href={`/all-books/${book._id}`} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-primary/60 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">View Details <ArrowUpRight aria-hidden="true" className="size-3.5" /></Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        <div className="mt-8 flex items-center justify-center gap-5">
          <span aria-hidden="true" className="h-px w-12 bg-[#c7a65e]/60 sm:w-24" />
          <Link href="/all-books" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#a9e9cd] px-6 text-sm font-medium text-[#102625] hover:bg-[#c4f4dc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd]"><BookOpen aria-hidden="true" className="size-4" /> See All Books <ArrowUpRight aria-hidden="true" className="size-4" /></Link>
          <span aria-hidden="true" className="h-px w-12 bg-[#c7a65e]/60 sm:w-24" />
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
