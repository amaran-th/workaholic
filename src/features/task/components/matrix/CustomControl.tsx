import { Button } from "@/components/ui/button";
import { CalendarSelect } from "@/components/ui/calendar";
import { selectedDateAtom } from "@/lib/react-flow/store/matrixAtom";
import { cn, notifyNotSupportedFeature } from "@/lib/utils/utils";
import { useReactFlow } from "@xyflow/react";
import { useAtom } from "jotai";
import { Camera, ChevronDown, ChevronUp, Focus } from "lucide-react";
import { useState } from "react";

const CustomControls = () => {
  const { fitView } = useReactFlow();
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [open, setOpen] = useState(false); // 패널 열림 상태

  return (
    <div className="absolute top-4 right-4 z-10 gap-1 flex flex-col items-end">
      <Button
        size="icon-sm"
        variant="outline"
        onClick={() => setOpen((prev) => !prev)}
        rounded
        className="bg-white hover:bg-white"
      >
        {open ? <ChevronUp /> : <ChevronDown />}
      </Button>

      <div
        className={cn(
          "bg-white rounded-md shadow-md overflow-hidden transition-all duration-300 ease-in-out transform origin-top-right",
          open
            ? "scale-100 opacity-100 max-h-[1000px]"
            : "scale-0 opacity-0 max-h-0"
        )}
      >
        <div className="p-2 flex flex-col gap-1">
          <CalendarSelect
            selected={selectedDate ?? null}
            onSelect={(newValue) => {
              if (!newValue) return;
              setSelectedDate(newValue);
            }}
          />
          <div className="flex gap-1 mt-1">
            <Button size="icon" variant="outline" onClick={() => fitView()}>
              <Focus />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => notifyNotSupportedFeature()}
            >
              <Camera />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomControls;
