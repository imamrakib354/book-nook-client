"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks({ navigation }: { navigation: { label: string; href: string }[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="order-3 w-full overflow-x-auto border-t border-border/60 pt-2 lg:order-none lg:w-auto lg:border-0 lg:pt-0">
      <ul className="flex min-w-max items-center gap-1 py-1 text-sm font-medium">
        {navigation.map(({ label, href }) => {
          const active = href === "/" ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? "page" : undefined} className={`inline-flex min-h-10 items-center whitespace-nowrap rounded-lg px-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${active ? "bg-accent text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
