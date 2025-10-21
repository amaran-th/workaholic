import * as React from "react";

import { Color, colorMap } from "@/lib/data";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const chipVariants = cva("rounded-full", {
  variants: {
    color: {
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
    },
    size: {
      default: "px-4 py-1 text-sm",
      sm: "px-2 text-[8px] py-0.5",
      lg: "px-2 text-[8px] py-0.5",
    },
  },
  defaultVariants: {
    color: "primary",
    size: "default",
  },
});

function Chip({
  className,
  label,
  customColor,
  size,
  ...props
}: React.ComponentProps<"span"> & {
  label: string;
  customColor?: Color;
} & VariantProps<typeof chipVariants>) {
  return (
    <span
      className={cn(chipVariants({ size, className }))}
      {...(customColor
        ? {
            style: {
              backgroundColor: colorMap[customColor].sub,
              color: colorMap[customColor].primary,
            },
          }
        : {})}
      {...props}
    >
      {label}
    </span>
  );
}

export { Chip };
