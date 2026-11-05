"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

const inputClass = "h-11 border-0 bg-[#223638] px-3 text-white placeholder:text-[#91a4a4] focus-visible:border-[#a9e9cd] focus-visible:ring-[#a9e9cd]/30";
const labelClass = "mb-2 text-xs font-normal text-[#b7c6c5]";

const SignUpPage = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

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
    if (isSubmitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const image = String(formData.get("image") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9\s]/.test(password)) {
      setFormError("Use at least 6 characters, including an uppercase letter, a lowercase letter, a number, and a special character.");
      return;
    }

    if (image) {
      try {
        if (!["http:", "https:"].includes(new URL(image).protocol)) throw new Error("Invalid image URL");
      } catch {
        setFormError("Enter a valid http or https profile picture URL.");
        return;
      }
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      const { data, error } = await authClient.signUp.email({ name, email, password, image: image || undefined });

      if (error) {
        setFormError(error.message || "Could not create your account. Please try again.");
        return;
      }

      if (data) {
        form.reset();
        setShowPassword(false);
        router.replace("/sign-in");
        router.refresh();
      } else {
        setFormError("Could not create your account. Please try again.");
      }
    } catch {
      setFormError("Unable to reach the sign-up service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 bg-[#0b191a] px-5 py-10 text-white sm:px-8 sm:py-14 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:gap-14 lg:gap-20">
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
          <h1 className="font-[family-name:var(--font-dm-serif)] text-3xl text-[#fffaf1] sm:text-4xl">
            Create your account
          </h1>

          <form ref={formRef} onSubmit={handleEmailSignUp} autoComplete="off" className="mt-9 space-y-5">

            <div>
              <Label htmlFor="sign-up-name" className={labelClass}>Full name</Label>
              <Input id="sign-up-name" name="name" type="text" autoComplete="off" required placeholder="Your name" className={inputClass} />
            </div>

            <div>
              <Label htmlFor="sign-up-email" className={labelClass}>Email</Label>
              <Input id="sign-up-email" name="email" type="email" autoComplete="off" required placeholder="you@example.com" className={inputClass} />
            </div>

            <div>
              <Label htmlFor="sign-up-image" className={labelClass}>Profile Pic URL <span className="text-[#91a4a4]">(optional)</span></Label>
              <Input id="sign-up-image" name="image" type="url" placeholder="https://..." className={inputClass} />
            </div>

            <div>
              <Label htmlFor="sign-up-password" className={labelClass}>Password</Label>
              <div className="relative">
                <Input
                  id="sign-up-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={6}
                  required
                  placeholder="Create a password"
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

              <p className="mt-2 text-xs text-[#9badae]">At least 6 characters with uppercase, lowercase, a number, and a special character.</p>
            </div>

            {formError && <p role="alert" className="text-sm text-[#f3b7a8]">{formError}</p>}

            <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#a9e9cd] text-sm font-medium text-[#102625] hover:bg-[#c4f4dc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd] disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting && <Spinner />}
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[#a7b8b8]">
            Already a member? <Link href="/sign-in" className="text-[#a9e9cd] hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-[#a9e9cd]">Sign in</Link>
          </p>

          <div className="my-7 flex items-center gap-4 text-xs text-[#9badae]">
            <span className="h-px flex-1 bg-[#294344]" />or<span className="h-px flex-1 bg-[#294344]" />
          </div>

          <div className="space-y-3">
            <button type="button" disabled title="Google sign-up is coming soon" className="flex h-11 w-full items-center justify-center gap-3 rounded-lg bg-[#223638] text-sm text-[#d2dddb] disabled:cursor-not-allowed">
              <span aria-hidden="true" className="text-base font-semibold">G</span> Continue with Google
            </button>
            <button type="button" disabled title="GitHub sign-up is coming soon" className="flex h-11 w-full items-center justify-center gap-3 rounded-lg bg-[#223638] text-sm text-[#d2dddb] disabled:cursor-not-allowed">
              <span aria-hidden="true" className="text-xs font-bold tracking-tight">GH</span> Continue with GitHub
            </button>
          </div>
          
        </section>
      </div>
    </main>
  );
};

export default SignUpPage;
