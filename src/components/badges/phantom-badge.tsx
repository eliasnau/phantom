"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { Command } from "lucide-react"

export function PhantomBadge({ className }: { className?: string }) {
    return (
        <Link
            href="https://phantom.js.org"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "group fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full border border-gray-200/30 bg-white/80 px-4 py-2 text-sm backdrop-blur-sm transition-all hover:scale-105 hover:border-gray-300 hover:bg-white hover:shadow-lg dark:border-gray-800/30 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:bg-gray-900",
                "hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]",
                "after:absolute after:inset-0 after:rounded-full after:opacity-0 after:transition-opacity hover:after:opacity-100 after:bg-gradient-to-r after:from-emerald-500/10 after:to-teal-500/10 dark:after:from-emerald-500/20 dark:after:to-teal-500/20",
                className
            )}
        >
            <span className="font-medium relative z-10">Built with</span>
            <Command className="h-4 w-4 text-emerald-600 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 relative z-10 dark:text-emerald-400" />
            <span className="font-semibold relative z-10">Phantom</span>
        </Link>
    )
}