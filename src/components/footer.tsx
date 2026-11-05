import Image from "next/image";
import Link from "next/link";
import bookNookLogo from "../../public/images/BookNook-Logo.png";
import { Camera } from "lucide-react";

const footerLinkClass = "transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const socialLinkClass = "flex size-9 items-center justify-center rounded-full bg-muted text-primary transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-chrome px-5 pt-12 pb-5 text-muted-foreground sm:px-8 lg:px-10">
      <div className="site-container">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.2fr_1.3fr] lg:gap-12">
          <div>
            <Link href="/" aria-label="BookNook home" className="inline-block rounded-xl border border-[#bda052]/40 bg-[#123d32] px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <Image
                src={bookNookLogo}
                alt="BookNook"
                sizes="176px"
                className="h-auto w-44 object-contain"
              />
            </Link>
            <p className="mt-3 max-w-64 text-sm leading-relaxed">
              A community-powered library for sharing great books, discovering new stories and borrowing freely.
            </p>
            <p className="mt-5 text-sm text-gold">Read. Share. Repeat.</p>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-dm-serif)] text-base text-foreground">Explore</h2>
            <nav aria-label="Explore" className="mt-4 flex flex-col items-start gap-3 text-sm">
              <Link href="/all-books" className={footerLinkClass}>All Books</Link>
              <span className="flex items-center gap-1">
                <Link href="/all-books?category=Fiction" className={footerLinkClass}>Fiction</Link>
                <span aria-hidden="true">·</span>
                <Link href="/all-books?category=Science" className={footerLinkClass}>Science</Link>
              </span>
              <span className="flex items-center gap-1">
                <Link href="/all-books?category=History" className={footerLinkClass}>History</Link>
                <span aria-hidden="true">·</span>
                <Link href="/all-books?category=Kids" className={footerLinkClass}>Kids</Link>
              </span>
            </nav>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-dm-serif)] text-base text-foreground">Community</h2>
            <nav aria-label="Community" className="mt-4 flex flex-col items-start gap-3 text-sm">
              <Link href="/#how-borrowing-works" className={footerLinkClass}>How Borrowing Works</Link>
              <Link href="/add-book" className={footerLinkClass}>Share a Book</Link>
              <Link href="/my-borrows" className={footerLinkClass}>My Borrowed Books</Link>
            </nav>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-dm-serif)] text-base text-foreground">Get in touch</h2>
            <a href="mailto:hello@booknook.app" className={`mt-4 inline-block text-sm ${footerLinkClass}`}>hello@booknook.app</a>
            <p className="mt-3 text-sm">Follow our reading community</p>
            <div className="mt-4 flex gap-2.5">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" className={socialLinkClass}>𝕏</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={`${socialLinkClass} font-semibold`}>f</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={socialLinkClass}><Camera aria-hidden="true" className="size-4" /></a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 BookNook. All rights reserved.</p>
          <p>Made for readers, by readers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
