// src/components/auth/auth-layout.tsx
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const features = [
  "Manage your products and inventory",
  "Record sales and track revenue",
  "Real-time dashboard analytics",
  "Low stock alerts and notifications",
];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Brand Side */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
        }}
      >
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Glow effect */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, #3b82f6, transparent)",
          }}
        />

        {/* Top: Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Image
              src="/BF_IconDark.png"
              alt="BusinessFlow Lite"
              width={52}
              height={52}
              className="rounded-lg"
            />
            <div>
              <p className="text-white font-bold text-xl leading-tight">
                BusinessFlow
              </p>
              <p className="text-blue-300 text-xs font-medium tracking-widest uppercase">
                Lite
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Hero Text */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Run your business
              <br />
              <span className="text-blue-300">smarter.</span>
            </h1>
            <p className="text-blue-200 text-base leading-relaxed max-w-sm">
              The all-in-one platform built for small business owners who want
              clarity, control, and growth.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                <span className="text-blue-100 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: Tagline */}
        <div className="relative z-10">
          <p className="text-blue-400 text-xs">
            © 2026 BusinessFlow Lite — Built for small business owners
          </p>
        </div>
      </div>

      {/* Right Panel — Form Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
        {/* Mobile logo — only shows on small screens */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <Image
            src="/BF_IconLight.png"
            alt="BusinessFlow Lite"
            width={40}
            height={40}
            className="dark:hidden"
          />
          <Image
            src="/BF_IconDark.png"
            alt="BusinessFlow Lite"
            width={40}
            height={40}
            className="hidden dark:block"
          />
          <span className="font-bold text-gray-900 dark:text-white text-lg">
            BusinessFlow <span className="text-blue-600">Lite</span>
          </span>
        </div>

        {/* Form card */}
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          {/* Card top accent */}
          <div
            className="h-1 w-full"
            style={{
              background: "linear-gradient(90deg, #1e3a5f, #3b82f6, #1e3a5f)",
            }}
          />

          {/* Logo inside card */}
          <div className="flex flex-col items-center pt-8 pb-2">
            <Image
              src="/BF_IconLight.png"
              alt="BusinessFlow Lite"
              width={64}
              height={64}
              className="dark:hidden"
            />
            <Image
              src="/BF_IconDark.png"
              alt="BusinessFlow Lite"
              width={64}
              height={64}
              className="hidden dark:block"
            />
          </div>

          {/* Form content */}
          <div className="px-8 pb-8 pt-2">{children}</div>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Secured with industry-standard encryption
        </p>
      </div>
    </div>
  );
}
