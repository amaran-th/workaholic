"use client";

import { sessionAtom } from "@/features/auth/store/sessionAtom";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { useGetSessionQuery } from "../auth-api";

export default function SessionInitializer() {
  const setSession = useSetAtom(sessionAtom);
  const { data, isLoading } = useGetSessionQuery();

  useEffect(() => {
    console.log("🔥 SessionInitializer mounted", isLoading);
    if (!isLoading) {
      console.log(data);
      setSession(data ?? null);
    }
  }, [data, isLoading, setSession]);

  return null;
}
