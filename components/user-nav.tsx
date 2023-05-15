"use client"

import { CreditCard, LogOut, PlusCircle, Settings, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react";

export function UserNav({ loggedIn = false, userData }: { loggedIn: boolean, userData?: any }) {
  return (
    <Button variant="ghost" className={`rounded-full h-14 ${loggedIn ? 'aspect-square p-2' : ''}`} onClick={() => signIn("AniListProvider")}>
      {loggedIn ? (
        <Avatar className="h-14 w-14">
          <AvatarImage src={userData?.picture.large} alt={`${userData?.name} profile image`} />
        </Avatar>) :
        "Login with AniList"
      }
    </Button>
  )
}