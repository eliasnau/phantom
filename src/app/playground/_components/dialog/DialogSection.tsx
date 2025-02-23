"use client"

import { Button } from "@/components/ui/button"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function DialogSection() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Responsive Dialog</h2>
      
      <div className="grid gap-4 p-4 border rounded-lg">
        <ResponsiveDialog
          trigger={<Button variant="outline">Edit Profile</Button>}
          title="Edit Profile"
          description="Make changes to your profile here. Click save when you're done."
        >
            <div className={cn("grid items-start gap-4")}>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" defaultValue="hello@example.com" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="@phantom" />
                </div>
                <Button type="submit">Save changes</Button>
            </div>
        </ResponsiveDialog>
      </div>
    </section>
  )
}