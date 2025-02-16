import { AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertProps {
  message: string;
  variant?: "error" | "warning";
  onDismiss?: () => void;
}

export function Alert({ message, variant = "error", onDismiss }: AlertProps) {
  return (
    <div className={cn(
      "rounded-lg p-4 text-sm flex items-center justify-between animate-fade-in",
      variant === "error" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"
    )}>
      <div className="flex items-center">
        {variant === "error" ? (
          <AlertCircle className="h-5 w-5 mr-2" />
        ) : (
          <AlertCircle className="h-5 w-5 mr-2" />
        )}
        {message}
      </div>
      {onDismiss && (
        <button onClick={onDismiss}>
          <XCircle className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}