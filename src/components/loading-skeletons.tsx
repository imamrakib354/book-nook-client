import type { ComponentProps, ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function Block({ className = "" }: ComponentProps<"div">) {
  return <Skeleton className={`bg-[#294344] motion-reduce:animate-none ${className}`} />;
}

function LoadingContent({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div role="status">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}

export function BooksGridSkeleton() {
  return (
    <LoadingContent label="Loading books...">
      <div className="mt-9 grid gap-5 sm:grid-cols-3">
        <Block className="h-11" /><Block className="h-11" /><Block className="h-11" />
      </div>
      <Block className="mt-10 h-4 w-32" />
      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="rounded-xl bg-[#172b2c] p-3">
            <Block className="h-64 rounded-lg" />
            <Block className="mt-4 h-3 w-28" />
            <Block className="mt-3 h-6 w-4/5" />
            <Block className="mt-2 h-4 w-1/2" />
            <Block className="mt-5 h-11" />
          </div>
        ))}
      </div>
    </LoadingContent>
  );
}

function StatsSkeleton() {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="rounded-xl bg-[#172b2c] p-6">
          <Block className="h-8 w-12" /><Block className="mt-3 h-4 w-28" />
        </div>
      ))}
    </div>
  );
}

function BookRowsSkeleton() {
  return (
    <div className="mt-10 divide-y divide-white/5 rounded-xl bg-[#172b2c] px-5 sm:px-7">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="grid grid-cols-2 items-center gap-4 py-5 md:grid-cols-[5rem_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_9rem] md:gap-6">
          <Block className="h-24 w-16" /><Block className="h-5 w-4/5" />
          <Block className="h-4 w-24" /><Block className="h-4 w-24" />
          <Block className="col-span-2 h-11 md:col-span-1" />
        </div>
      ))}
    </div>
  );
}

export function MyBooksSkeleton() {
  return (
    <LoadingContent label="Loading your books...">
      <StatsSkeleton />
      <Block className="mt-9 h-11" />
      <BookRowsSkeleton />
    </LoadingContent>
  );
}

type PageVariant = "page" | "details" | "borrows" | "profile" | "form";

export function PageSkeleton({ variant = "page" }: { variant?: PageVariant }) {
  return (
    <main className="flex-1 bg-[#0b191a] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
      <div className={`mx-auto ${variant === "form" ? "max-w-3xl" : "max-w-6xl"}`}>
        <LoadingContent label="Loading page...">
          <Block className="h-9 w-2/3 max-w-80" />
          <Block className="mt-3 h-4 w-3/4 max-w-md" />
          {variant === "details" ? (
            <div className="mt-8 grid gap-9 md:grid-cols-2 lg:gap-12">
              <Block className="h-[420px] rounded-xl sm:h-[480px]" />
              <div className="space-y-6 py-4">
                <Block className="h-4 w-24" /><Block className="h-12 w-4/5" />
                <Block className="h-4 w-36" /><Block className="h-28" />
                <Block className="h-40 rounded-xl" /><Block className="h-11 w-44" />
              </div>
            </div>
          ) : variant === "borrows" ? (
            <>
              <StatsSkeleton />
              <div className="mt-9 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(10rem,0.4fr)_auto]">
                <Block className="h-16" /><Block className="h-16" /><Block className="h-11 w-40 self-end" />
              </div>
              <BookRowsSkeleton />
            </>
          ) : variant === "profile" ? (
            <div className="mt-8 rounded-xl bg-[#172b2c] p-6 sm:p-8">
              <div className="flex items-center gap-5">
                <Block className="size-20 shrink-0 rounded-full" />
                <div className="flex-1"><Block className="h-6 w-1/2" /><Block className="mt-3 h-4 w-2/3" /></div>
              </div>
              <StatsSkeleton /><Block className="mt-9 h-9 w-28" />
            </div>
          ) : variant === "form" ? (
            <div className="mt-8 space-y-8 rounded-2xl bg-[#172b2c] p-6 sm:p-10">
              <div className="grid gap-6 sm:grid-cols-2">
                {Array.from({ length: 6 }, (_, index) => <Block key={index} className="h-16" />)}
              </div>
              <Block className="h-56 rounded-xl" /><Block className="h-28" /><Block className="h-11" />
            </div>
          ) : <><Block className="mt-8 h-56 rounded-xl" /><StatsSkeleton /></>}
        </LoadingContent>
      </div>
    </main>
  );
}
