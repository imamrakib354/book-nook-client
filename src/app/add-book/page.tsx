import { Suspense } from "react";

import AddBookForm from "@/components/add-book-form";
import { PageSkeleton } from "@/components/loading-skeletons";
import { getCurrentUser } from "@/lib/get-current-user";

async function AuthenticatedAddBook() {
  const user = await getCurrentUser();
  if (!user) return null;
  return <AddBookForm name={user.name} email={user.email} />;
}

export default function AddBookPage() {
  return <Suspense fallback={<PageSkeleton variant="form" />}><AuthenticatedAddBook /></Suspense>;
}
