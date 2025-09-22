"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { sessionAtom } from "../store/sessionAtom";
import { MemberSession } from "../types/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setSession] = useAtom(sessionAtom);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = (await res.json()) as MemberSession | { error: string };

      if ("error" in data) throw new Error(data.error);

      setSession(data);
      router.push("/");
    } catch (err) {
      if (err instanceof Error) alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="bg-green-500 text-white p-2 rounded">
        Login
      </button>
    </form>
  );
}
