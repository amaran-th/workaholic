import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 disabled:cursor-default [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
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
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        progress: "bg-progress text-white hover:bg-progress/90",
        success: "bg-success text-white hover:bg-success/90",
        error: "bg-error text-white hover:bg-error/90",
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
      {
        variant: "default",
        color: "primary",
        className: "bg-primary text-primary-foreground hover:bg-primary/90",
      },
      {
        variant: "default",
        color: "secondary",
        className:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90",
      },
      {
        variant: "default",
        color: "progress",
        className: "bg-progress text-white hover:bg-progress/90",
      },
      {
        variant: "default",
        color: "success",
        className: "bg-success text-white hover:bg-success/90",
      },
      {
        variant: "default",
        color: "error",
        className: "bg-error text-white hover:bg-error/90",
      },
      // Outline + Color
      {
        variant: "outline",
        color: "primary",
        className:
          "border-primary text-primary bg-transparent hover:bg-primary/10",
      },
      {
        variant: "outline",
        color: "secondary",
        className:
          "border-secondary text-secondary bg-transparent hover:bg-secondary/10",
      },
      {
        variant: "outline",
        color: "progress",
        className:
          "border-progress text-progress bg-transparent hover:bg-progress/10",
      },
      {
        variant: "outline",
        color: "success",
        className:
          "border-success text-success bg-transparent hover:bg-success/10",
      },
      {
        variant: "outline",
        color: "error",
        className: "border-error text-error bg-transparent hover:bg-error/10",
      },

      // Ghost + Color
      {
        variant: "ghost",
        color: "primary",
        className: "hover:bg-accent dark:hover:bg-accent/50",
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

      // Destructive + Color
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
  rounded = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    rounded?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, color, className }),
        rounded && "rounded-full"
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
