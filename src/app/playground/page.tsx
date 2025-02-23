"use client"

import { ToastSection } from "./_components/toast/ToastSection"
import { Button } from "@/components/ui/button"

export default function PlaygroundPage() {
  return (
    <div className="container py-10 space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Component Playground</h1>
        <Button variant="outline">Back to Home</Button>
      </div>

      <div className="space-y-8">
        <ToastSection />
        {/* Add more sections here */}
      </div>
    </div>
  )
}