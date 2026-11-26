"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  LoaderCircle,
  Flower2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  const { login, isAuthenticated, loading, user, getRedirectPath } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace(getRedirectPath(user));
    }
  }, [loading, isAuthenticated, user, getRedirectPath, router]);


  const onSubmit = async (values) => {
    setIsSubmitting(true);
    setLoginError("");

    try {
      const result = await login({
        email: values.email,
        password: values.password,
      });

      router.replace(result.redirectTo);
    } catch (error) {
      setLoginError(
        error.message || "Invalid email or password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <main className="min-h-[calc(100vh-5rem)] bg-background">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl lg:grid-cols-2">

        {/* Left Branding Section */}
        <section className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:p-16">
          <div className="absolute -right-28 -top-28 size-96 rounded-full border border-white/10" />
          <div className="absolute -bottom-40 -left-32 size-[30rem] rounded-full border border-white/10" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-white/15">
              <Flower2 size={27} />
            </div>

            <div>
              <p className="text-xl font-bold tracking-tight">
                MuhuratMitra
              </p>
              <p className="text-xs text-primary-foreground/70">
                Your Spiritual Companion
              </p>
            </div>
          </div>

          <div className="relative z-10 max-w-lg">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
              <Sparkles size={16} />
              Discover auspicious moments
            </div>

            <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
              Bring positivity
              <br />
              into every
              <br />
              <span className="text-primary-foreground/75">
                new beginning.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-primary-foreground/75">
              Discover daily Panchang, find auspicious Muhurat,
              book trusted Pandits and celebrate every special
              occasion with confidence.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/15 bg-white/10 p-4">
                <ShieldCheck size={22} />
                <p className="mt-3 font-semibold">Trusted Pandits</p>
                <p className="mt-1 text-xs text-primary-foreground/70">
                  Connect with experienced priests
                </p>
              </div>

              <div className="rounded-xl border border-white/15 bg-white/10 p-4">
                <Sparkles size={22} />
                <p className="mt-3 font-semibold">Shubh Muhurat</p>
                <p className="mt-1 text-xs text-primary-foreground/70">
                  Find the right time for every occasion
                </p>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-xs text-primary-foreground/60">
            © 2026 MuhuratMitra. All rights reserved.
          </p>
        </section>

        {/* Right Login Section */}
        <section className="flex items-center justify-center px-4 py-12 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">

            {/* Mobile Brand */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Flower2 size={25} />
              </div>

              <div>
                <p className="text-lg font-bold text-foreground">
                  MuhuratMitra
                </p>
                <p className="text-xs text-muted-foreground">
                  Your Spiritual Companion
                </p>
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold text-primary">
                WELCOME BACK
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Sign in to your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Enter your details below to access your
                MuhuratMitra account.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Email Address
                </label>

                <div className={`flex h-12 items-center gap-3 rounded-lg border bg-background px-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 ${errors.email ? "border-destructive" : "border-input"
                  }`}>
                  <Mail
                    size={18}
                    className="shrink-0 text-muted-foreground"
                  />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>

                {errors.email && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-foreground"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className={`flex h-12 items-center gap-3 rounded-lg border bg-background px-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 ${errors.password ? "border-destructive" : "border-input"
                  }`}>
                  <LockKeyhole
                    size={18}
                    className="shrink-0 text-muted-foreground"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    {...register("password")}
                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="shrink-0 text-muted-foreground transition hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Login Error */}
              {loginError && (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
                >
                  {loginError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-primary hover:underline"
              >
                Create account
              </Link>
            </p>

            {/* Demo Note */}
            <div className="mt-8 rounded-xl border border-border bg-muted/40 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-primary"
                />

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Demo Authentication
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    This is a mock login for development. Any valid
                    email and a password of at least 6 characters
                    will work. Admin access is assigned using the
                    designated admin email.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-primary">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-primary">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

