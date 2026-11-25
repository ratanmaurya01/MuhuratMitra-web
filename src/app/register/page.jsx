

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address"),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.boolean().refine((value) => value === true, {
      message: "Please accept the Terms and Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const inputClass =
  "w-full rounded-xl border border-input bg-background py-3 pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10";

function FormField({
  label,
  icon: Icon,
  error,
  children,
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label}
      </label>

      <div className="relative">
        <Icon
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        {children}
      </div>

      {error && (
        <p className="text-xs text-destructive">{error.message}</p>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (values) => {
    setSubmitError("");

    try {
      // Demo registration: replace with your registration API.
      const existingUser = {
        id: `USER_${Date.now()}`,
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone,
        role: "USER",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(
        "muhuratmitra_user",
        JSON.stringify(existingUser)
      );

      router.replace("/");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background">
      <div className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-2">
        {/* Left Branding Section */}
        <section className="relative hidden overflow-hidden bg-primary px-10 py-16 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:px-20">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-primary-foreground/10" />
          <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full border border-primary-foreground/10" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/15">
                <Sparkles size={26} />
              </div>

              <span className="text-2xl font-bold tracking-tight">
                MuhuratMitra
              </span>
            </Link>
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-sm">
              <Sparkles size={15} />
              Begin Your Spiritual Journey
            </div>

            <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
              Create your account and bring
              <span className="block text-primary-foreground/75">
                positivity into every beginning.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-primary-foreground/75">
              Discover auspicious Muhurat, explore daily Panchang,
              book trusted Pandits and manage your important
              religious occasions in one place.
            </p>

            <div className="mt-10 space-y-5">
              {[
                {
                  icon: CalendarDays,
                  title: "Personalized Panchang",
                  description: "Daily Panchang and auspicious timings.",
                },
                {
                  icon: ShieldCheck,
                  title: "Trusted Pandits",
                  description: "Connect with experienced Pandits.",
                },
                {
                  icon: CheckCircle2,
                  title: "Easy Puja Booking",
                  description: "Manage your bookings in one place.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15">
                    <item.icon size={21} />
                  </div>

                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-primary-foreground/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} MuhuratMitra. All rights reserved.
          </p>
        </section>

        {/* Registration Form */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile Branding */}
            <Link
              href="/"
              className="mb-8 flex items-center justify-center gap-2 lg:hidden"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Sparkles size={21} />
              </div>
              <span className="text-xl font-bold">MuhuratMitra</span>
            </Link>

            <div className="mb-8">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-saffron-light text-primary">
                <User size={24} />
              </div>

              <h2 className="text-3xl font-bold tracking-tight">
                Create an account
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Join MuhuratMitra and start your spiritual journey.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                label="Full Name"
                icon={User}
                error={errors.name}
              >
                <input
                  {...register("name")}
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  className={inputClass}
                />
              </FormField>

              <FormField
                label="Email Address"
                icon={Mail}
                error={errors.email}
              >
                <input
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </FormField>

              <FormField
                label="Mobile Number"
                icon={Phone}
                error={errors.phone}
              >
                <input
                  {...register("phone")}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  className={inputClass}
                />
              </FormField>

              <FormField
                label="Password"
                icon={Lock}
                error={errors.password}
              >
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </FormField>

              <FormField
                label="Confirm Password"
                icon={Lock}
                error={errors.confirmPassword}
              >
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((value) => !value)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </FormField>

              <div>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    {...register("terms")}
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-primary"
                  />

                  <span className="text-sm leading-6 text-muted-foreground">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="font-medium text-primary hover:underline"
                    >
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="font-medium text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>

                {errors.terms && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.terms.message}
                  </p>
                )}
              </div>

              {submitError && (
                <p role="alert" className="text-sm text-destructive">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
                {!isSubmitting && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">
                ALREADY HAVE AN ACCOUNT?
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Already registered?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              By creating an account, you agree to use MuhuratMitra
              responsibly.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

