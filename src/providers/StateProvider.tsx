"use client";

import { Provider as JotaiProvider } from "jotai";
import { ReactNode } from "react";

export default function StateProvider({ children }: { children: ReactNode }) {
  return <JotaiProvider>{children}</JotaiProvider>;
}
