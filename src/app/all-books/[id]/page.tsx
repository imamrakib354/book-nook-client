import { Suspense } from "react";
import { notFound } from "next/navigation";

import BookDetailsPage from "@/components/bookDetailsPage";
import { PageSkeleton } from "@/components/loading-skeletons";
import type { IBook } from "@/lib/types/IBook";
import { getCurrentUser } from "@/lib/get-current-user";
import { getTokenFromServer } from "@/lib/getTokenFromServer";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
type BookPageProps = { params: Promise<{ id: string }> };

const BookContent = async ({ params }: BookPageProps) => {
  const user = await getCurrentUser();
  if (!user) return null;
  const { id } = await params;
  const token = await getTokenFromServer();
  const response = await fetch(`${apiUrl}/books/${encodeURIComponent(id)}`, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("Unable to load book details.");

  const book: IBook = await response.json();
  if (!book) notFound();

  return <BookDetailsPage book={book} user={{ name: user.name, email: user.email }} />;
};

const BookPage = (props: BookPageProps) => (
  <Suspense fallback={<PageSkeleton variant="details" />}>
    <BookContent params={props.params} />
  </Suspense>
);

export default BookPage;
