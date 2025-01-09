"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function HistoryNav() {
  const pathname = usePathname();

  return (
    <div className="relative">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className="flex items-center">
          <Link
            href="/"
            className={cn("flex h-7 items-center justify-center rounded-full px-4 text-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary data-[active=true]:bg-muted data-[active=true]:text-primary", pathname === "/history" && "text-white")}
            data-active={pathname === "/"}
          >
            All
          </Link>

          <Link
            href="/history/videos"
            className={cn("flex h-7 items-center justify-center rounded-full px-4 text-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary data-[active=true]:bg-muted data-[active=true]:text-primary", pathname?.startsWith("/history/videos") && "text-white")}
            data-active={pathname?.startsWith("/history/videos") ?? false}
          >
            Videos
          </Link>

          <Link
            href="/history/audios"
            className={cn("flex h-7 items-center justify-center rounded-full px-4 text-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary data-[active=true]:bg-muted data-[active=true]:text-primary", pathname?.startsWith("/history/audios") && "text-white")}
            data-active={pathname?.startsWith("/history/audios") ?? false}
          >
            Audios
          </Link>

          <Link
            href="/history/unfinished"
            className={cn("flex h-7 items-center justify-center rounded-full px-4 text-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary data-[active=true]:bg-muted data-[active=true]:text-primary", pathname?.startsWith("/history/unfinished") && "text-white")}
            data-active={pathname?.startsWith("/history/unfinished") ?? false}
          >
            Unfinished
          </Link>
          
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
