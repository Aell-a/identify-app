"use client";

import Image from "next/image";
import Link from "next/link";
import * as HoverCard from "@radix-ui/react-hover-card";
import { cn } from "@/lib/utils";

export default function MiniUserProfile({
  user,
  children,
  align = "center",
  side = "bottom",
}) {
  return (
    <HoverCard.Root openDelay={200} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <Link
          href={`/profile/${user.id}`}
          className="inline-flex items-center space-x-2 cursor-pointer"
        >
          {children}
        </Link>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          align={align}
          side={side}
          sideOffset={5}
          className={cn(
            "z-50 w-64 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-md outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2",
            "data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2",
            "data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          <Link
            href={`/users/${user.nickname}`}
            className="block hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center space-x-4 mb-2">
              <Image
                src={user.profilePicture}
                alt={user.nickname}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <h3 className="font-semibold text-gray-100">{user.nickname}</h3>
                <p className="text-sm text-gray-400">Joined: {user.joinDate}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-2 line-clamp-2">{user.bio}</p>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Points: {user.totalPoints}</span>
            </div>
          </Link>
          <HoverCard.Arrow className="fill-gray-700" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
