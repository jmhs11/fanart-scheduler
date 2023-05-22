"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Session } from "next-auth";
import MediaEmbed from "./media-embed";

interface ActivityPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  text: any;
  session: Session | null;
}

export function ActivityPreview({
  text,
  session,
  className,
  children,
  ...props
}: ActivityPreviewProps) {
  console.log(session);

  if (!session) return null;

  return (
    <div className="rounded-md border p-4">
      <header>
        <Link
          href={`https://anilist.co/user/${session?.user?.name}`}
          className="flex items-center"
        >
          <Avatar className="h-10 w-10 rounded-none">
            <AvatarImage
              src={session?.user?.avatar.medium as string}
              alt={`${session?.user?.name} profile image`}
            />
          </Avatar>
          <span className="ml-3">{session.user?.name}</span>
        </Link>
      </header>
      <div className="my-[14px]">
        {children}
      </div>
    </div>
  );
}
