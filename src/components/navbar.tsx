import Image from "next/image";
import Link from "next/link";
import bookNookLogo from "../../public/images/BookNook-Logo.png";
import ModeToggle from "@/components/mode-toggle";
import NavLinks from "@/components/nav-links";

import { getCurrentUser } from "@/lib/get-current-user";
import ProfileDropdown from "@/components/profilePage/profile-dropdown";

const publicNavigation = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/all-books" },
];

const privateNavigation = [
  { label: "Add Book", href: "/add-book" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

const Navbar = async () => {
  const user = await getCurrentUser();
  const navigation = user ? [...publicNavigation, ...privateNavigation] : publicNavigation;
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card px-5 text-foreground shadow-sm sm:px-8 lg:px-10">
      <div className="site-container flex flex-wrap items-center justify-between gap-x-3 py-3 lg:flex-nowrap lg:gap-8">
        <Link href="/" aria-label="BookNook home" className="shrink-0 rounded-xl border border-[#bda052]/40 bg-[#123d32] px-2 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          <Image
            src={bookNookLogo}
            alt="BookNook"
            priority
            sizes="(max-width: 640px) 112px, 176px"
            className="h-auto w-28 object-contain sm:w-44"
          />
        </Link>

        <NavLinks navigation={navigation} />

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2 lg:ml-0">
          {user ? (
            <ProfileDropdown name={user.name} email={user.email} image={user.image} />
          ) : (
            <div className="flex shrink-0 items-center gap-2 text-xs sm:text-sm">
              <Link href="/sign-in" className="inline-flex h-9 items-center justify-center rounded-md bg-muted px-3 text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-4">
                Log in
              </Link>
              <Link href="/sign-up" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-4">
                Sign up
              </Link>
            </div>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
