"use client";

import { authClient } from "@/lib/auth-client";
import { toast } from "@contentstack/react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff, FiLock, FiLogIn, FiMail } from "react-icons/fi";

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const loginFormHandler = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const user = Object.fromEntries(formData.entries());
    console.log("login form data:", user);

    const { data, error } = await authClient.signIn.email({
      email: user.email,
      password: user.password,
      callbackURL: "/",
    });

    if (data) {
      toast.success("👋 Sign in successful!");
      form.reset();
      router.push("/");
    }

    if (error) {
      console.error("login error:", error);
      toast.error(`❌ ${error.message || "Login failed"}`);
    }
  };

  const googleSignInHandler = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      // callbackURL: "/",
    });

    if (error) {
      console.error("google sign-in error:", error);
      toast.error(`❌ ${error.message || "Google sign-in failed"}`);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-base-100 px-4 py-12 text-base-content">
      <div className="card w-full max-w-md border border-base-300 bg-base-200 shadow-sm">
        <div className="card-body gap-5">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-sm text-base-content/70">
              Login to continue with Rentivo
            </p>
          </div>

          <form className="space-y-5" onSubmit={loginFormHandler}>
            <label className="form-control w-full">
              <span className="label-text mb-2">Email</span>
              <div className="join w-full">
                <span className="join-item flex items-center border border-base-300 bg-base-100 px-3 text-base-content/60">
                  <FiMail size={18} />
                </span>
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  className="input join-item input-bordered w-full bg-base-100"
                />
              </div>
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-2">Password</span>
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
            </label>

            <div className="mt-2 flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-base-content/80">
                <input
                  name="rememberMe"
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                />
                Remember me
              </label>
              <Link
                href="#"
                className="font-medium text-base-content underline underline-offset-4 hover:text-base-content/75"
              >
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              <FiLogIn size={18} />
              Login
            </button>

            <div className="divider text-xs text-base-content/60">
              Or login with
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
            Do not have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-base-content underline underline-offset-4 hover:text-base-content/75"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
