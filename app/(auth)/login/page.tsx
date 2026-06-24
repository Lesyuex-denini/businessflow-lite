// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verified = searchParams.get("verified");
  const registered = searchParams.get("registered");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthLayout>
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Sign in to your BusinessFlow account
        </p>
      </div>

      {/* Banners */}
      {verified && (
        <div className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg mb-4">
          ✓ Email verified! You can now sign in.
        </div>
      )}
      {registered && (
        <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg mb-4">
          ✓ Account created! You can now sign in.
        </div>
      )}
      {error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* OAuth */}
      <OAuthButtons />
      <AuthDivider />

      {/* Credentials form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
          style={{
            background: loading
              ? undefined
              : "linear-gradient(90deg, #1e3a5f, #2563eb)",
          }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
        >
          Create one free
        </Link>
      </p>
    </AuthLayout>
  );
}
