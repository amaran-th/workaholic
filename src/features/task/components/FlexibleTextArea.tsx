import { cn } from "@/lib/utils";
import { debounceOnChange } from "@/lib/utils/debounceOnChange";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  TextareaHTMLAttributes,
  useRef,
} from "react";

function FlexibleTextArea({
  text,
  setText,
  className,
  debounceCallback,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  debounceCallback?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value);

    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
    if (debounceCallback) {
      debounceOnChange(() => {
        debounceCallback(e);
      });
    }
  };
  return (
    <textarea
      ref={textareaRef}
      onChange={handleChange}
      className={cn(
        "min-w-0 w-full resize-none overflow-hidden focus-visible:outline-0 placeholder:text-placeholder",
        className
      )}
      value={text}
      {...props}
    />
  );
}

export default FlexibleTextArea;
