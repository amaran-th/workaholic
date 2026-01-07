import { cn } from "@/lib/utils/utils";
import {
  ChangeEvent,
  Dispatch,
  FocusEvent,
  SetStateAction,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
} from "react";

function FlexibleTextArea({
  text,
  setText,
  className,
  onBlur,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  onBlurCommit?: (e: FocusEvent<HTMLTextAreaElement>) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value);

    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  };

  const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    if (onBlur) {
      onBlur(e);
    }
  };
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []); // 마운트 시 한 번만 실행
  return (
    <textarea
      ref={textareaRef}
      onChange={handleChange}
      onBlur={handleBlur}
      onDragStartCapture={(e) => e.stopPropagation()}
      onMouseDownCapture={(e) => e.stopPropagation()}
      className={cn(
        "min-w-0 w-full resize-none overflow-hidden focus-visible:outline-0 placeholder:text-placeholder",
        "min-h-0 h-auto",
        className
      )}
      value={text}
      {...props}
    />
  );
}

export default FlexibleTextArea;
