"use client"


import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AnilistUser } from "@/pages/api/auth/[...nextauth]";
import { User } from "next-auth";
import { signIn } from "next-auth/react";

export function LoginButton({ loggedIn = false, userData }: { loggedIn: boolean, userData?: AnilistUser }) {
  return (
    <Button variant="ghost" className={`rounded-full h-14 ${loggedIn ? 'aspect-square p-2' : ''}`} onClick={() => signIn("AniListProvider")}>
      {loggedIn ? (
        <Avatar className="h-14 w-14">
          <AvatarImage src={userData?.avatar.medium} alt={`${userData?.name} profile image`} />
        </Avatar>) :
        "Login with AniList"
      }
    </Button>
  )
}