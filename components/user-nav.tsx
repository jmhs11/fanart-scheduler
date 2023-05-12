import { CreditCard, LogOut, PlusCircle, Settings, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function UserNav({loggedIn = false}) {
  return (
    <Button variant="ghost" className="relative rounded-full">
      {loggedIn ? (
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="@shadcn" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>) : (
        <Link className="" href='https://anilist.co/api/v2/oauth/authorize?client_id=12621&response_type=token'>Login with AniList</Link>
      )}
    </Button>
  )
}