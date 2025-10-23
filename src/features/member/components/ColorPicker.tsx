import { Button } from "@/components/ui/button";
import { Color, colorMap } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useState } from "react";

interface ColorPickerProps {
  selectedColor: Color;
  onSelect: (color: Color) => void;
  readonly?: boolean;
}

function ColorPicker({ selectedColor, onSelect, readonly }: ColorPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="w-8 h-8 p-0 rounded-full border-2 border-gray-200 disabled:opacity-100 disabled:pointer-events-auto"
          style={{
            background: `linear-gradient(135deg, ${colorMap[selectedColor].sub} 50%, ${colorMap[selectedColor].bg} 50%)`,
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          disabled={readonly}
        />
      </PopoverTrigger>

      <PopoverContent className="flex gap-2 p-2 w-fit bg-white shadow-lg rounded-md">
        {(Object.keys(colorMap) as Color[]).map((color) => {
          const { bg, sub } = colorMap[color];
          return (
            <button
              key={color}
              className={cn(
                "relative w-6 h-6 rounded-full transition-all hover:scale-105",
                {
                  "ring-2 ring-offset-2 ring-gray-400": selectedColor === color,
                }
              )}
              style={{
                background: `linear-gradient(135deg, ${sub} 50%, ${bg} 50%)`,
                borderColor: color === selectedColor ? sub : "transparent",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(color);
                setOpen(false);
              }}
              aria-label={color}
            >
              {selectedColor === color && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white/70" />
                </div>
              )}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

export default ColorPicker;
