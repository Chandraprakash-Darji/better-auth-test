"use client";
import { useSession } from "@/lib/client";
import Link from "next/link";

export default function Home() {
  const user = useSession();
  return (
    <div className="dark text-foreground bg-background items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
      <p className="border-orange-600 bg-white/5 whitespace-pre-wrap rounded-xl border-2 p-2 font-mono text-xs">
        {JSON.stringify(user, null, 2)}
      </p>

      {[
        "login",
        "signup",
        "logout",
        "magic-link",
        "forgot-password",
        "reset-password",
      ].map((i) => (
        <Link
          key={i}
          className={
            "w-full mt-2 flex gap-2 max-w-60 border-2 items-center justify-center border-white/40 hover:bg-white/5 rounded-md p-2"
          }
          href={`/auth/${i}`}
        >
          {i}
        </Link>
      ))}
    </div>
  );
}
