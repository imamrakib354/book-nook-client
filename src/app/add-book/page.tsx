import { Suspense } from "react";

import AddBookForm from "@/components/add-book-form";
import { requireSession } from "@/lib/require-session";

async function AuthenticatedAddBook() {
  const { user } = await requireSession();
  return <AddBookForm name={user.name} email={user.email} />;
}

export default function AddBookPage() {
  return <Suspense fallback={<main className="flex-1 bg-[#0b191a]" />}><AuthenticatedAddBook /></Suspense>;
}
