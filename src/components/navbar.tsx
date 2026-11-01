import Image from "next/image";
import Link from "next/link";

const navigation = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
  { label: "Add Book", href: "/add-book" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0e1d1e] text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-5 px-5 py-3 sm:px-8 lg:flex-nowrap lg:gap-8 lg:px-10">
        <Link href="/" aria-label="BookNook home" className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd]">
          <Image
            src="/images/BookNook-Logo.png"
            alt="BookNook"
            width={1254}
            height={1254}
            priority
            className="h-12 w-36 object-cover sm:h-14 sm:w-44"
          />
        </Link>

        <nav aria-label="Main navigation" className="order-3 w-full overflow-x-auto lg:order-none lg:w-auto">
          <ul className="flex min-w-max items-center gap-5 py-2 text-xs text-[#9badae] sm:gap-8 sm:text-sm lg:gap-9">
            {navigation.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="whitespace-nowrap rounded-sm transition-colors hover:text-[#a9e9cd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd]">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2 text-xs sm:text-sm">
          <Link href="/login" className="inline-flex h-9 items-center justify-center rounded-md bg-[#223638] px-3 text-[#d2dddb] transition-colors hover:bg-[#30484a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd] sm:px-4">
            Log in
          </Link>
          <Link href="/register" className="inline-flex h-9 items-center justify-center rounded-md bg-[#a9e9cd] px-3 font-medium text-[#102625] transition-colors hover:bg-[#c4f4dc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd] sm:px-4">
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
