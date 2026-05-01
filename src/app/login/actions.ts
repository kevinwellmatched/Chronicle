"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getSafeRedirectPath } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";

function encodeStatusParam(key: "error" | "message", value: string) {
  return `${key}=${encodeURIComponent(value)}`;
}

async function getRequestOrigin() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (origin) {
    return origin;
  }

  const host = headerStore.get("host") ?? "localhost:3000";
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}`;
}

export async function signInWithMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const next = getSafeRedirectPath(String(formData.get("next") ?? ""));

  if (!email) {
    redirect(
      `/login?next=${encodeURIComponent(next)}&${encodeStatusParam(
        "error",
        "Enter an email address.",
      )}`,
    );
  }

  const supabase = await createClient();
  const origin = await getRequestOrigin();
  const emailRedirectTo = new URL("/auth/confirm", origin);
  emailRedirectTo.searchParams.set("next", next);

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: emailRedirectTo.toString(),
      shouldCreateUser: false,
    },
  });

  if (error) {
    redirect(
      `/login?next=${encodeURIComponent(next)}&${encodeStatusParam(
        "error",
        "Unable to send a sign-in link for that email.",
      )}`,
    );
  }

  redirect(
    `/login?next=${encodeURIComponent(next)}&${encodeStatusParam(
      "message",
      "Check your email for a Chronicle sign-in link.",
    )}`,
  );
}
