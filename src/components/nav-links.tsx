"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function NavLinks({ navigation, showAccountLinks = false }: { navigation: { label: string; href: string }[]; showAccountLinks?: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="col-start-1 row-start-1 justify-self-start lg:col-start-2 lg:justify-self-center">
      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger aria-label="Open navigation menu" className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted text-foreground hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary">
            <Menu aria-hidden="true" className="size-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" sideOffset={12} className="w-60 max-w-[calc(100vw-1.5rem)] rounded-xl border border-border bg-card p-2 text-foreground shadow-xl">
            {navigation.map(({ label, href }) => {
              const active = href === "/" ? pathname === href : pathname.startsWith(href);
              return (
                <DropdownMenuItem key={href} render={<Link href={href} />} aria-current={active ? "page" : undefined} className={`min-h-11 cursor-pointer rounded-lg px-3 text-sm font-medium ${active ? "bg-accent text-primary" : "text-foreground"}`}>
                  {label}
                </DropdownMenuItem>
              );
            })}
            {showAccountLinks && <>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/sign-in" />} className="min-h-11 cursor-pointer px-3">Log in</DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/sign-up" />} className="min-h-11 cursor-pointer px-3">Sign up</DropdownMenuItem>
            </>}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ul className="hidden items-center gap-1 py-1 text-sm font-medium lg:flex">
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
