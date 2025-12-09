import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

/**
 * Variants for alert styling
 */
const alertVariants = cva(
  "relative w-full rounded-md border p-4 flex items-start gap-3 text-sm",
  {
    variants: {
      variant: {
        default: "bg-blue-50 border-blue-300 text-blue-900 dark:bg-blue-950/40 dark:text-blue-100",
        destructive: "bg-red-50 border-red-400 text-red-900 dark:bg-red-950/40 dark:text-red-100",
        success: "bg-green-50 border-green-400 text-green-900 dark:bg-green-950/40 dark:text-green-100",
        warning: "bg-yellow-50 border-yellow-400 text-yellow-900 dark:bg-yellow-950/40 dark:text-yellow-100",
        info: "bg-slate-50 border-slate-300 text-slate-900 dark:bg-slate-900 dark:text-slate-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Main Alert wrapper
 */
const Alert = React.forwardRef(({ className, variant, children, ...props }, ref) => {
  const icons = {
    destructive: XCircle,
    success: CheckCircle2,
    warning: AlertTriangle,
    default: Info,
    info: Info,
  };

  const Icon = icons[variant] || Info;

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0 opacity-80" />
      <div className="flex-1">{children}</div>
    </div>
  );
});
Alert.displayName = "Alert";

/**
 * Optional title
 */
const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn("font-semibold leading-none tracking-tight mb-0.5", className)} {...props} />
));
AlertTitle.displayName = "AlertTitle";

/**
 * Description text
 */
const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
