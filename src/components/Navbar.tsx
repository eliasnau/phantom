"use client";

import { useSession } from "@/util/auth-client";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { signOut } from "@/util/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function Navbar() {
  const { data: session, isPending } = useSession();

  return (
    <nav className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-serif">
            Starter Kit
          </Link>

          <div className="flex items-center gap-4">
            {isPending ? (
              <div className="h-8 w-8 bg-muted animate-pulse" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 p-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session.user.image || undefined} alt={session.user.name ?? ""} />
                      <AvatarFallback>
                        {session.user.name?.charAt(0) || <User className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56 rounded-lg" 
                  align="end"
                >
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image || undefined} alt={session.user.name ?? ""} />
                      <AvatarFallback>
                        {session.user.name?.charAt(0) || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4 text-destructive" />
                    <span className="text-destructive">Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/sign-in">
                <Button variant="default" className="rounded-full">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}