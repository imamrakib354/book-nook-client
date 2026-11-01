import Image from "next/image";
import Link from "next/link";
import { Camera } from "lucide-react";

const footerLinkClass = "transition-colors hover:text-[#a9e9cd] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd]";

const socialLinkClass = "flex size-9 items-center justify-center rounded-full bg-[#223638] text-[#a9e9cd] transition-colors hover:bg-[#304c48] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd]";

export default function Footer() {
  return (
    <footer className="bg-[#0e1d1e] px-5 pt-12 pb-5 text-[#99aaab] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.2fr_1.3fr] lg:gap-12">
          <div>
            <Link href="/" aria-label="BookNook home" className="inline-block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd]">
              <Image
                src="/images/BookNook-Logo.png"
                alt="BookNook"
                width={1254}
                height={1254}
                className="h-14 w-44 object-cover"
              />
            </Link>
            <p className="mt-3 max-w-64 text-sm leading-relaxed">
              A community-powered library for sharing great books, discovering new stories and borrowing freely.
            </p>
            <p className="mt-5 text-sm text-[#e5c58f]">Read. Share. Repeat.</p>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-dm-serif)] text-base text-white">Explore</h2>
            <nav aria-label="Explore" className="mt-4 flex flex-col items-start gap-3 text-sm">
              <Link href="/books" className={footerLinkClass}>All Books</Link>
              <span className="flex items-center gap-1">
                <Link href="/books?category=Fiction" className={footerLinkClass}>Fiction</Link>
                <span aria-hidden="true">·</span>
                <Link href="/books?category=Science" className={footerLinkClass}>Science</Link>
              </span>
              <span className="flex items-center gap-1">
                <Link href="/books?category=History" className={footerLinkClass}>History</Link>
                <span aria-hidden="true">·</span>
                <Link href="/books?category=Kids" className={footerLinkClass}>Kids</Link>
              </span>
            </nav>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-dm-serif)] text-base text-white">Community</h2>
            <nav aria-label="Community" className="mt-4 flex flex-col items-start gap-3 text-sm">
              <Link href="/#how-borrowing-works" className={footerLinkClass}>How Borrowing Works</Link>
              <Link href="/add-book" className={footerLinkClass}>Share a Book</Link>
              <Link href="/my-borrows" className={footerLinkClass}>My Borrowed Books</Link>
            </nav>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-dm-serif)] text-base text-white">Get in touch</h2>
            <a href="mailto:hello@booknook.app" className={`mt-4 inline-block text-sm ${footerLinkClass}`}>hello@booknook.app</a>
            <p className="mt-3 text-sm">Follow our reading community</p>
            <div className="mt-4 flex gap-2.5">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" className={socialLinkClass}>𝕏</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={`${socialLinkClass} font-semibold`}>f</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={socialLinkClass}><Camera aria-hidden="true" className="size-4" /></a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/15 pt-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 BookNook. All rights reserved.</p>
          <p>Made for readers, by readers.</p>
        </div>
      </div>
    </footer>
  );
}
