import { cn } from "@/lib/utils";
import { debounceOnChange } from "@/lib/utils/debounceOnChange";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  TextareaHTMLAttributes,
  useEffect,
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
