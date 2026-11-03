import { Suspense } from "react";
import { notFound } from "next/navigation";

import BookDetailsPage from "@/components/bookDetailsPage";
import type { IBook } from "@/lib/types/IBook";
import { requireSession } from "@/lib/require-session";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
type BookPageProps = { params: Promise<{ id: string }> };

const BookDetailsSkeleton = () => (
  <main className="flex-1 bg-[#0b191a] px-5 py-10 sm:px-8 lg:px-10">
    <div className="mx-auto max-w-6xl animate-pulse">
      <div className="h-4 w-48 rounded bg-[#223638]" />
      <div className="mt-8 grid gap-9 md:grid-cols-2 lg:gap-12">
        <div className="h-[480px] rounded-xl bg-[#172b2c]" />
        <div className="space-y-6 pt-2">
          <div className="h-4 w-36 rounded bg-[#223638]" />
          <div className="h-12 w-3/4 rounded bg-[#223638]" />
          <div className="h-4 w-40 rounded bg-[#223638]" />
          <div className="h-20 rounded bg-[#223638]" />
          <div className="h-32 rounded-xl bg-[#172b2c]" />
        </div>
      </div>
    </div>
  </main>
);

const BookContent = async ({ params }: BookPageProps) => {
  const { user } = await requireSession();
  const { id } = await params;
  const response = await fetch(`${apiUrl}/all-books/${encodeURIComponent(id)}`, { cache: "no-store" });

  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("Unable to load book details.");

  const book: IBook = await response.json();
  if (!book) notFound();

  return <BookDetailsPage book={book} user={{ name: user.name, email: user.email }} />;
};

const BookPage = (props: BookPageProps) => (
  <Suspense fallback={<BookDetailsSkeleton />}>
    <BookContent params={props.params} />
  </Suspense>
);

export default BookPage;
