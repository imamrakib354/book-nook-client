import { LoaderCircle } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div role="status" className="flex min-h-48 flex-col items-center justify-center gap-3 text-[#a9e9cd]">
      <LoaderCircle aria-hidden="true" className="size-8 animate-spin motion-reduce:animate-none" />
      <span className="text-sm">Loading...</span>
    </div>
  );
}
