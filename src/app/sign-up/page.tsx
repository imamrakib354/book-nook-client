"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import ProfilePhotoInput, { type ProfilePhotoInputHandle } from "@/components/profile-photo-input";

const inputClass = "h-11 border-border bg-field px-3 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/30";
const labelClass = "mb-2 text-xs font-normal text-muted-foreground";

const SignUpPage = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const photoRef = useRef<ProfilePhotoInputHandle>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialProvider, setSocialProvider] = useState<"google" | "github" | null>(null);
  const [passwordError, setPasswordError] = useState(false);
  const isBusy = isSubmitting || socialProvider !== null;

  useEffect(() => {
    const form = formRef.current;
    const resetForm = () => form?.reset();

    resetForm();
    // Clear browser-restored values as well as values in a cached route.
    window.addEventListener("pageshow", resetForm);
    return () => {
      window.removeEventListener("pageshow", resetForm);
      resetForm();
    };
  }, []);

  const handleEmailSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      setPasswordError(true);
      return;
    }

    setPasswordError(false);
    setIsSubmitting(true);

    try {
      const image = await photoRef.current!.getImage();
      const { data, error } = await authClient.signUp.email({ name, email, password, image: image || undefined });

      if (error) {
        toast.error(error.message || "Could not create your account.");
        return;
      }

      if (data) {
        toast.success("Account created successfully! Please sign in.");
        form.reset();
        setShowPassword(false);
        router.replace("/sign-in");
        router.refresh();
      } else {
        toast.error("Could not create your account.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to reach the sign-up service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    if (isBusy) return;

    setSocialProvider(provider);

    try {
      const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
      const callbackURL = callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//") && !callbackUrl.includes("\\")
        ? callbackUrl : "/";
      const { error } = await authClient.signIn.social({ provider, callbackURL });

      if (error) {
        toast.error(error.message || "Could not start social sign-up.");
        setSocialProvider(null);
      }
    } catch {
      toast.error("Unable to reach the sign-up service.");
      setSocialProvider(null);
    }
  };

  return (
    <main className="flex-1 bg-background px-5 py-10 text-foreground sm:px-8 sm:py-14 lg:px-10">
      <div className="site-container grid gap-10 md:grid-cols-2 md:gap-14 lg:gap-20">
        <section className="flex min-h-[520px] flex-col overflow-hidden rounded-2xl bg-[#214c46] p-7 sm:p-9 md:min-h-[620px]">
          <h2 className="font-[family-name:var(--font-dm-serif)] text-4xl leading-tight text-[#fffaf1] sm:text-5xl">
            Turn the page.<br />Join the story.
          </h2>
          <p className="mt-5 text-sm text-[#cfdfd8]">Your community library starts with a single book.</p>
          <div className="relative mt-9 min-h-72 flex-1 overflow-hidden rounded-xl">
            <Image
              src="/images/Sign-up.png"
              alt="A warmly lit library shelf filled with books"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
              priority
            />
          </div>
        </section>

        <section className="flex flex-col justify-center py-3 md:py-10">
          <h1 className="font-[family-name:var(--font-dm-serif)] text-3xl text-foreground sm:text-4xl">
            Create your account
          </h1>

          <form ref={formRef} onSubmit={handleEmailSignUp} autoComplete="off" aria-busy={isBusy} className="mt-9 space-y-5">

            <div>
              <Label htmlFor="sign-up-name" className={labelClass}>Full name</Label>
              <Input id="sign-up-name" name="name" type="text" autoComplete="off" required placeholder="Your name" className={inputClass} />
            </div>

            <div>
              <Label htmlFor="sign-up-email" className={labelClass}>Email</Label>
              <Input id="sign-up-email" name="email" type="email" autoComplete="off" required placeholder="you@example.com" className={inputClass} />
            </div>

            <ProfilePhotoInput ref={photoRef} disabled={isBusy} />

            <div>
              <Label htmlFor="sign-up-password" className={labelClass}>Password</Label>
              <div className="relative">
                <Input
                  id="sign-up-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={6}
                  pattern="(?=.*[a-z])(?=.*[A-Z]).{6,}"
                  title="Use at least 6 characters, including an uppercase and a lowercase letter."
                  aria-describedby="password-help"
                  aria-invalid={passwordError}
                  onInvalid={() => setPasswordError(true)}
                  onChange={() => setPasswordError(false)}
                  required
                  placeholder="Create a password"
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-muted-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {showPassword ? <EyeOff aria-hidden="true" className="size-5" /> : <Eye aria-hidden="true" className="size-5" />}
                </button>
              </div>

              <p id="password-help" className={`mt-2 text-xs ${passwordError ? "text-red-700 dark:text-[#f3b7a8]" : "text-muted-foreground"}`}>Use at least 6 characters, including an uppercase and a lowercase letter.</p>
            </div>

            <button type="submit" disabled={isBusy} aria-busy={isSubmitting} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting && <Spinner />}
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already a member? <Link href="/sign-in" className="text-primary hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary">Sign in</Link>
          </p>

          <div className="my-7 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-3">
            <button type="button" onClick={() => handleSocialLogin("google")} disabled={isBusy} aria-busy={socialProvider === "google"} className="flex h-11 w-full items-center justify-center gap-3 rounded-lg bg-muted text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-60">
              {socialProvider === "google" && <Spinner />}
              <span aria-hidden="true" className="text-base font-semibold">G</span> Continue with Google
            </button>
            <button type="button" onClick={() => handleSocialLogin("github")} disabled={isBusy} aria-busy={socialProvider === "github"} className="flex h-11 w-full items-center justify-center gap-3 rounded-lg bg-muted text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-60">
              {socialProvider === "github" && <Spinner />}
              <span aria-hidden="true" className="text-xs font-bold tracking-tight">GH</span> Continue with GitHub
            </button>
          </div>
          
        </section>
      </div>
    </main>
  );
};

export default SignUpPage;
