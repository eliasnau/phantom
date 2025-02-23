"use client"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { toast as hotToast } from "react-hot-toast"

export function ToastSection() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Toast Notifications</h2>
      
      <div className="grid gap-4 p-4 border rounded-lg">
        <h3 className="text-lg font-medium">Sonner Examples</h3>
        <div className="flex gap-2">
          <Button 
            onClick={() => toast("Default notification")}
            variant="outline"
          >
            Default
          </Button>
          
          <Button 
            onClick={() => toast.success("Success notification")}
            variant="outline"
          >
            Success
          </Button>
          
          <Button 
            onClick={() => {
                toast.error("An error has occurred", {
                    description: "If the error persists please contact the owner of this site",
                })
            }}
            variant="outline"
          >
            Error
          </Button>

          <Button 
            onClick={() => 
              toast("Action required", {
                action: {
                  label: "Undo",
                  onClick: () => console.log("Undo clicked")
                }
              })
            }
            variant="outline"
          >
            With Action
          </Button>
        </div>

        <h3 className="text-lg font-medium mt-4">React Hot Toast Examples</h3>
        <div className="flex gap-2">
          <Button 
            onClick={() => hotToast("Simple notification")}
            variant="outline"
          >
            Simple
          </Button>
          
          <Button 
            onClick={() => hotToast.success("Success!")}
            variant="outline"
          >
            Success
          </Button>
          
          <Button 
            onClick={() => hotToast.error("Error occurred")}
            variant="outline"
          >
            Error
          </Button>
        </div>
      </div>
    </section>
  )
}