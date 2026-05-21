"use client";

import { authClient } from "@/lib/auth-client";
import { toast } from "@contentstack/react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  FiCheck,
  FiEye,
  FiEyeOff,
  FiImage,
  FiLock,
  FiMail,
  FiRefreshCw,
  FiUser,
} from "react-icons/fi";

const Register = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const registerFormHandler = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const user = Object.fromEntries(formData.entries());
    console.log("register form data:", user);

    const { data, error } = await authClient.signUp.email({
      email: user.email,
      password: user.password,
      name: user.name,
      image: user.photoURL || undefined,
      callbackURL: "/",
    });

    if (data) {
      toast.success("🎉 Account created successfully!");
      form.reset();
      router.push("/");
    }

    if (error) {
      console.error("registration error:", error);
      toast.error(`❌ ${error.message || "Registration failed"}`);
    }
  };

  const googleSignInHandler = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    if (error) {
      console.error("google sign-in error:", error);
      toast.error(`❌ ${error.message || "Google sign-in failed"}`);
    }
  };

  const resetButtonHandler = (event) => {
    event.currentTarget.form?.reset();
  };

  return (
    <section className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-base-100 px-4 py-12 text-base-content">
      <div className="card w-full max-w-md border border-base-300 bg-base-200 shadow-sm">
        <div className="card-body gap-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-sm text-base-content/70">
              Start your journey with Rentivo
            </p>
          </div>

          <form className="space-y-4" onSubmit={registerFormHandler}>
            <label className="block w-full space-y-2">
              <span className="block text-sm font-medium">
                Full Name <span className="text-error">*</span>
              </span>
              <div className="join w-full">
                <span className="join-item flex items-center border border-base-300 bg-base-100 px-3 text-base-content/60">
                  <FiUser size={18} />
                </span>
                <input
                  required
                  name="name"
                  type="text"
                  minLength={2}
                  placeholder="John Doe"
                  title="Full name must be at least 2 characters"
                  className="input join-item input-bordered w-full bg-base-100"
                />
              </div>
            </label>

            <label className="block w-full space-y-2">
              <span className="block text-sm font-medium">
                Email <span className="text-error">*</span>
              </span>
              <div className="join w-full">
                <span className="join-item flex items-center border border-base-300 bg-base-100 px-3 text-base-content/60">
                  <FiMail size={18} />
                </span>
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  title="Please enter a valid email address"
                  className="input join-item input-bordered w-full bg-base-100"
                />
              </div>
            </label>

            <label className="block w-full space-y-2">
              <span className="block text-sm font-medium">Photo URL</span>
              <div className="join w-full">
                <span className="join-item flex items-center border border-base-300 bg-base-100 px-3 text-base-content/60">
                  <FiImage size={18} />
                </span>
                <input
                  name="photoURL"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  title="Please enter a valid URL"
                  className="input join-item input-bordered w-full bg-base-100"
                />
              </div>
              <span className="block text-xs text-base-content/60">
                Optional. Add a direct link to your profile photo.
              </span>
            </label>

            <label className="block w-full space-y-2">
              <span className="block text-sm font-medium">
                Password <span className="text-error">*</span>
              </span>
              <div className="join w-full">
                <span className="join-item flex items-center border border-base-300 bg-base-100 px-3 text-base-content/60">
                  <FiLock size={18} />
                </span>
                <input
                  required
                  minLength={6}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  pattern="(?=.*[a-z])(?=.*[A-Z]).{6,}"
                  title="Must be at least 6 characters with 1 uppercase letter and 1 lowercase letter"
                  placeholder="Enter your password"
                  className="input join-item input-bordered w-full bg-base-100"
                />
                <button
                  type="button"
                  className="btn join-item border border-base-300 bg-base-100 px-3 text-base-content/60"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((isVisible) => !isVisible)}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              <span className="block text-xs text-base-content/60">
                Must be at least 6 characters with 1 uppercase and 1 lowercase
                letter.
              </span>
            </label>

            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <button type="submit" className="btn btn-primary">
                <FiCheck size={18} />
                Submit
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={resetButtonHandler}
              >
                <FiRefreshCw size={18} />
                Reset
              </button>
            </div>

            <div className="divider text-xs text-base-content/60">
              Or sign up with
            </div>

            <button
              type="button"
              className="btn btn-outline w-full"
              onClick={googleSignInHandler}
            >
              <FcGoogle size={20} />
              Google
            </button>
          </form>

          <p className="text-center text-sm text-base-content/70">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-base-content underline underline-offset-4 hover:text-base-content/75"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
