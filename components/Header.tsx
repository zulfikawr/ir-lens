"use client";

import React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Search from "./Search";
import SocialSharing from "./SocialSharing";

const tags = [
  {
    title: "Diplomacy",
    href: "/tags/Diplomacy",
    description: "International relations, diplomatic missions, and global partnerships",
  },
  {
    title: "Economy",
    href: "/tags/Economy",
    description: "World markets, trade relations, and economic developments",
  },
  {
    title: "Conflicts",
    href: "/tags/Conflicts",
    description: "Current global conflicts, peace processes, and security matters",
  },
  {
    title: "Climate",
    href: "/tags/Climate",
    description: "Environmental issues, climate change, and sustainability efforts",
  },
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className="group block select-none space-y-1 p-3 leading-none no-underline outline-none transition-colors focus:underline"
          {...props}
        >
          <div className="text-sm font-medium leading-none group-hover:underline">
            {title}
          </div>
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function Header() {
  return (
    <header className="px-4 md:px-8 md:pt-8 pt-4">
      <div className="flex justify-between items-center">
        <Link href="/" className="flex-none">
          <span className="py-2 px-3 bg-black text-white border hover:bg-white hover:text-black hover:border hover:border-black">
            IR Lens
          </span>
        </Link>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger aria-labelledby="button-label">
              <span id="button-label" hidden>
                Menu
              </span>
              <svg
                aria-hidden="true"
                width="25"
                height="16"
                viewBox="0 0 25 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="25" height="4" fill="black" />
                <rect y="6" width="25" height="4" fill="black" />
                <rect y="12" width="25" height="4" fill="black" />
              </svg>
            </SheetTrigger>
            <SheetContent
              side="top"
              className="w-full pt-14"
              aria-label="Menu Toggle"
            >
              <nav
                className="flex flex-col flex-1 justify-end gap-6"
                aria-labelledby="mobile-nav"
              >
                <Link href="/" className="hover:underline">
                  Home
                </Link>
                <Link href="/news" className="hover:underline">
                  News
                </Link>
                <div className="flex flex-col gap-4">
                  <p className="font-medium">Tags:</p>
                  {tags.map((tag) => (
                    <Link
                      key={tag.title}
                      href={tag.href}
                      className="hover:underline pl-4"
                    >
                      {tag.title}
                    </Link>
                  ))}
                </div>
                <svg
                  width="15"
                  height="1"
                  viewBox="0 0 15 1"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="15" height="1" fill="black" />
                </svg>
                <Search />
                <SocialSharing
                  links={[
                    {
                      href: "#",
                      ariaLabel: "Visit our Instagram page",
                      src: "/icons/ri_instagram-line.svg",
                      alt: "Instagram logo",
                    },
                    {
                      href: "#",
                      ariaLabel: "Visit our Twitter page",
                      src: "/icons/ri_twitter-fill.svg",
                      alt: "Twitter logo",
                    },
                  ]}
                />
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between w-full items-center">
          <div className="flex items-center gap-6 px-4">
            <NavigationMenu className="h-full">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/articles" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Articles
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Tags</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 max-h-[calc(100vh-4rem)] overflow-auto">
                      {tags.map((tag) => (
                        <ListItem
                          key={tag.title}
                          title={tag.title}
                          href={tag.href}
                        >
                          {tag.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-4">
            <Search />
          </div>
        </div>
      </div>
      <hr className="border-black border-t-0 border mt-4" />
    </header>
  );
}
