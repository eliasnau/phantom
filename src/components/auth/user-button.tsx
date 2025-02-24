"use client"

import { UserButton } from "@clerk/nextjs"
import { HelpCircle } from "lucide-react"
import Link from "next/link"

export function CustomUserButton() {
    return (
        <UserButton>
            <UserButton.MenuItems>
                <UserButton.Action
                    label="Help"
                    labelIcon={<HelpCircle className="mr-2 h-4 w-4" />}
                    open="help"
                />
            </UserButton.MenuItems>

            <UserButton.UserProfilePage
                label="Help"
                labelIcon={<HelpCircle className="mr-2 h-4 w-4" />}
                url="help"
            >
                <div>
                    <h1>Help Page</h1>
                    <p>This is the custom help page</p> {/* TODO: Add a real help page */}
                </div>
            </UserButton.UserProfilePage>
        </UserButton>
    )
}