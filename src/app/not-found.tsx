import Link from "next/link";

const NotFound = () => (
  <main className="flex flex-1 flex-col items-center justify-center bg-[#0b191a] px-5 py-24 text-center text-white sm:px-8">
    <p className="font-[family-name:var(--font-dm-serif)] text-8xl leading-none text-[#a9e9cd] sm:text-9xl">404</p>
    <h1 className="mt-5 font-[family-name:var(--font-dm-serif)] text-2xl text-[#fffaf1] sm:text-4xl">
      This page lost its bookmark.
    </h1>
    <p className="mt-4 text-sm text-[#9badae]">The story you were looking for is not on this shelf.</p>
    <Link href="/" className="mt-10 flex h-11 min-w-44 items-center justify-center rounded-lg bg-[#a9e9cd] px-6 text-sm font-medium text-[#102625] hover:bg-[#c4f4dc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd]">
      Back to home <span aria-hidden="true" className="ml-1">→</span>
    </Link>
  </main>
);

export default NotFound;
