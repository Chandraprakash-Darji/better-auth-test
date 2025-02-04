"use client";

import { useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { AuthCard, AuthToastOptions } from "@daveyplate/better-auth-ui";

import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { authClient } from "@/lib/client";

export default function AuthView() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const redirectTo = "/";

  const authToast = useCallback(
    ({ variant, description, action }: AuthToastOptions) => {
      toast({
        variant,
        description,
        action: action && (
          <ToastAction altText={action.label} onClick={action.onClick}>
            {action.label}
          </ToastAction>
        ),
      });
    },
    [toast]
  );

  return (
    <main className="flex flex-col items-center my-auto p-4">
      <AuthCard
        authClient={authClient}
        pathname={pathname}
        appRouter={router}
        providers={["google"]}
        toast={authToast}
        redirectTo={redirectTo}
        LinkComponent={Link}
        onSessionChange={() => router.refresh()}
      />
    </main>
  );
}
