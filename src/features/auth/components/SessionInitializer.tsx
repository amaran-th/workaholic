"use client";
import { supabase } from "@/lib/supabase";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { sessionAtom } from "../store/sessionAtom";

export default function SessionInitializer() {
  const setSession = useSetAtom(sessionAtom);

  useEffect(() => {
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      const s = data.session;
      if (s) {
        setSession({
          user: {
            id: s.user.id,
            email: s.user.email || "",
          },
          access_token: s.access_token,
          expires_in: s.expires_in || 0,
          refresh_token: s.refresh_token || "",
          token_type: s.token_type || "bearer",
        });
      } else {
        setSession(null);
      }
    };

    initSession();

    // 로그인 상태 변화 자동 동기화
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setSession({
            user: {
              id: session.user.id,
              email: session.user.email || "",
            },
            access_token: session.access_token,
            expires_in: session.expires_in || 0,
            refresh_token: session.refresh_token || "",
            token_type: session.token_type || "bearer",
          });
        } else {
          setSession(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [setSession]);

  return null;
}
