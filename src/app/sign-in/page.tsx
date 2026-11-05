"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

const inputClass = "h-11 border-0 bg-[#223638] px-3 text-white placeholder:text-[#91a4a4] focus-visible:border-[#a9e9cd] focus-visible:ring-[#a9e9cd]/30";
const labelClass = "mb-2 text-xs font-normal text-[#b7c6c5]";

const SignInPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialProvider, setSocialProvider] = useState<"google" | "github" | null>(null);
  const [formError, setFormError] = useState("");

  const isBusy = isSubmitting || socialProvider !== null;

  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setFormError("");
    setIsSubmitting(true);

    try {
      const { data, error } = await authClient.signIn.email({ email, password });

      if (error) {
        setFormError(error.message || "Could not sign in. Please check your email and password.");
        return;
      }

      if (data) {
        form.reset();
        setShowPassword(false);
        const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
        const destination = callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//") && !callbackUrl.includes("\\")
          ? callbackUrl : "/";
        router.replace(destination);
        router.refresh();
      } else {
        setFormError("Could not sign in. Please try again.");
      }
    } catch {
      setFormError("Unable to reach the sign-in service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    if (isBusy) return;

    setFormError("");
    setSocialProvider(provider);

    try {
      const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
      const callbackURL = callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//") && !callbackUrl.includes("\\")
        ? callbackUrl : "/";
        
      const { error } = await authClient.signIn.social({ provider, callbackURL });

      if (error) {
        setFormError(error.message || "Could not start social sign-in. Please try again.");
        setSocialProvider(null);
      }
    } catch {
      setFormError("Unable to reach the sign-in service. Please try again.");
      setSocialProvider(null);
    }
  };

  return (
    <main className="flex-1 bg-[#0b191a] px-5 py-10 text-white sm:px-8 sm:py-14 lg:px-10">

      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:gap-14 lg:gap-20">
        <section className="flex min-h-[520px] flex-col overflow-hidden rounded-2xl bg-[#214c46] p-7 sm:p-9 md:min-h-[680px] md:pt-16">

          <h2 className="font-[family-name:var(--font-dm-serif)] text-4xl leading-tight text-[#fffaf1] sm:text-5xl">
            Welcome back<br />to the nook.
          </h2>
          <p className="mt-5 text-sm text-[#cfdfd8]">A new story is waiting on the shelf.</p>
          <div className="relative mt-9 min-h-72 flex-1 overflow-hidden rounded-xl">
            <Image
              src="/images/sign-in.png"
              alt="A cozy library with books, a reading lamp, and an open book"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
              preload
            />
          </div>
          
        </section>

        <section className="flex flex-col justify-center py-3 md:py-10">
          <h1 className="font-[family-name:var(--font-dm-serif)] text-3xl text-[#fffaf1] sm:text-4xl">
            Sign in to BookNook
          </h1>
          <p className="mt-2 text-sm text-[#9badae]">Continue your journey of shared stories.</p>

          <form onSubmit={handleEmailLogin} aria-busy={isBusy} className="mt-12 space-y-6">
            <div>
              <Label htmlFor="sign-in-email" className={labelClass}>Email address</Label>
              <Input id="sign-in-email" name="email" type="email" autoComplete="username" required placeholder="you@example.com" className={inputClass} />
            </div>
            <div>
              <Label htmlFor="sign-in-password" className={labelClass}>Password</Label>
              <div className="relative">
                <Input
                  id="sign-in-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-[#b7c6c5] hover:text-[#a9e9cd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd]"
                >
                  {showPassword ? <EyeOff aria-hidden="true" className="size-5" /> : <Eye aria-hidden="true" className="size-5" />}
                </button>
              </div>
              <div className="mt-4 text-right">
                <button type="button" disabled title="Password reset is coming soon" className="text-xs text-[#a9e9cd] disabled:cursor-not-allowed">
                  Forgot password?
                </button>
              </div>
            </div>

            {formError && <p role="alert" className="text-sm text-[#f3b7a8]">{formError}</p>}

            <button type="submit" disabled={isBusy} aria-busy={isSubmitting} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#a9e9cd] text-sm font-medium text-[#102625] hover:bg-[#c4f4dc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd] disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting && <Spinner />}
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 space-y-3">

            <button type="button" onClick={() => handleSocialLogin("google")} disabled={isBusy} aria-busy={socialProvider === "google"} className="flex h-11 w-full items-center justify-center gap-3 rounded-lg bg-[#223638] text-sm text-[#d2dddb] disabled:cursor-not-allowed disabled:opacity-60">
              {socialProvider === "google" && <Spinner />}
              <span aria-hidden="true" className="text-base font-semibold">G</span> Continue with Google
            </button>

            <button type="button" onClick={() => handleSocialLogin("github")} disabled={isBusy} aria-busy={socialProvider === "github"} className="flex h-11 w-full items-center justify-center gap-3 rounded-lg bg-[#223638] text-sm text-[#d2dddb] disabled:cursor-not-allowed disabled:opacity-60">
              {socialProvider === "github" && <Spinner />}
              <span aria-hidden="true" className="text-xs font-bold tracking-tight">GH</span> Continue with GitHub
            </button>

          </div>

          <p className="mt-8 text-center text-sm text-[#a7b8b8]">
            New to BookNook? <Link href="/sign-up" className="text-[#a9e9cd] hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-[#a9e9cd]">Create an account</Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default SignInPage;
