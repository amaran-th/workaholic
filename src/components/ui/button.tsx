import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs dark:bg-input/30 dark:border-input",
        ghost: "hover:bg-accent dark:hover:bg-accent/50",
        link: "underline-offset-4 hover:underline",
      },
      color: {
        primary: "",
        secondary: "",
        progress: "",
        success: "",
        error: "",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      color: "primary",
      size: "default",
    },
    compoundVariants: [
      // Outline + Color
      {
        variant: "outline",
        color: "primary",
        className: "border-primary text-primary-foreground hover:bg-primary/10",
      },
      {
        variant: "outline",
        color: "secondary",
        className:
          "border-secondary text-secondary-foreground hover:bg-secondary/10",
      },
      {
        variant: "outline",
        color: "progress",
        className:
          "border-progress text-progress-foreground hover:bg-progress/10",
      },
      {
        variant: "outline",
        color: "success",
        className: "border-success text-success-foreground hover:bg-success/10",
      },
      {
        variant: "outline",
        color: "error",
        className: "border-error text-error-foreground hover:bg-error/10",
      },

      // Ghost + Color
      {
        variant: "ghost",
        color: "primary",
        className: "text-primary-foreground hover:bg-primary/10",
      },
      {
        variant: "ghost",
        color: "secondary",
        className: "text-secondary-foreground hover:bg-secondary/10",
      },
      {
        variant: "ghost",
        color: "progress",
        className: "text-progress-foreground hover:bg-progress/10",
      },
      {
        variant: "ghost",
        color: "success",
        className: "text-success-foreground hover:bg-success/10",
      },
      {
        variant: "ghost",
        color: "error",
        className: "text-error-foreground hover:bg-error/10",
      },

      // Destructive + Color (필요하면 override 가능)
      {
        variant: "destructive",
        color: "primary",
        className: "bg-destructive text-white hover:bg-destructive/90",
      },
      {
        variant: "destructive",
        color: "secondary",
        className: "bg-destructive text-white hover:bg-destructive/90",
      },
      {
        variant: "destructive",
        color: "progress",
        className: "bg-destructive text-white hover:bg-destructive/90",
      },
      {
        variant: "destructive",
        color: "success",
        className: "bg-destructive text-white hover:bg-destructive/90",
      },
      {
        variant: "destructive",
        color: "error",
        className: "bg-destructive text-white hover:bg-destructive/90",
      },

      // Link + Color
      {
        variant: "link",
        color: "primary",
        className: "text-primary hover:underline",
      },
      {
        variant: "link",
        color: "secondary",
        className: "text-secondary hover:underline",
      },
      {
        variant: "link",
        color: "progress",
        className: "text-progress hover:underline",
      },
      {
        variant: "link",
        color: "success",
        className: "text-success hover:underline",
      },
      {
        variant: "link",
        color: "error",
        className: "text-error hover:underline",
      },
    ],
  }
);

function Button({
  className,
  variant,
  size,
  color,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, color, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
