"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { Input, Button } from "@/components/ui";
import { authApi } from "@/lib/api/auth";

const registerContainer = cva(
  "min-h-screen bg-white flex items-center justify-center p-4"
);

const registerCard = cva(
  "w-full max-w-md bg-white border-2 border-black shadow-sharp p-10"
);

const logoContainer = cva(
  "flex items-center justify-center gap-3 mb-8"
);

const logoIcon = cva(
  "w-12 h-12 bg-black rounded-none flex items-center justify-center text-white font-bold text-2xl"
);

const logoText = cva(
  "text-2xl font-bold tracking-tight"
);

const title = cva(
  "text-3xl font-black tracking-tighter text-black uppercase mb-2 text-center"
);

const subtitle = cva(
  "text-gray-500 text-center mb-8"
);

const form = cva("space-y-6");

const divider = cva(
  "relative flex items-center justify-center my-6"
);

const dividerLine = cva(
  "absolute w-full border-t border-gray-200"
);

const dividerText = cva(
  "relative bg-white px-4 text-xs font-bold uppercase tracking-widest text-gray-400"
);

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<{
    displayName?: string;
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      // Navigate to login page on success
      router.push("/login");
    },
    onError: (error: Error) => {
      setErrors({
        password: error.message || "Registration failed. Please try again.",
      });
    },
  });

  const validateForm = () => {
    const newErrors: {
      displayName?: string;
      email?: string;
      username?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};

    if (!displayName.trim()) {
      newErrors.displayName = "Display name is required";
    } else if (displayName.trim().length < 2) {
      newErrors.displayName = "Display name must be at least 2 characters";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreeToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    registerMutation.mutate({
      email,
      username: username.trim(),
      password,
      displayName: displayName.trim(),
    });
  };

  return (
    <div className={registerContainer()}>
      <div className={registerCard()}>
        <div className={logoContainer()}>
          <div className={logoIcon()}>A</div>
          <span className={logoText()}>
            Admin<span className="font-normal">Panel</span>
          </span>
        </div>

        <h1 className={title()}>Create Account</h1>
        <p className={subtitle()}>
          Sign up to get started with your admin account
        </p>

        <form onSubmit={handleSubmit} className={form()}>
          <Input
            label="Display Name"
            icon="person"
            type="text"
            placeholder="홍길동"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              if (errors.displayName) {
                setErrors({ ...errors, displayName: undefined });
              }
            }}
            error={errors.displayName}
          />

          <Input
            label="Username"
            icon="badge"
            type="text"
            placeholder="master_gil"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) {
                setErrors({ ...errors, username: undefined });
              }
            }}
            error={errors.username}
          />

          <Input
            label="Email Address"
            icon="email"
            type="email"
            placeholder="gil1000je@naver.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) {
                setErrors({ ...errors, email: undefined });
              }
            }}
            error={errors.email}
          />

          <Input
            label="Password"
            icon="lock"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                setErrors({ ...errors, password: undefined });
              }
              // Clear confirm password error if passwords match
              if (confirmPassword && e.target.value === confirmPassword) {
                setErrors({ ...errors, confirmPassword: undefined });
              }
            }}
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            icon="lock"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                setErrors({ ...errors, confirmPassword: undefined });
              }
            }}
            error={errors.confirmPassword}
          />

          <div className="space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => {
                  setAgreeToTerms(e.target.checked);
                  if (errors.terms) {
                    setErrors({ ...errors, terms: undefined });
                  }
                }}
                className="h-5 w-5 text-black border-2 border-black rounded-none focus:ring-0 cursor-pointer mt-0.5 flex-shrink-0"
              />
              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-black font-bold hover:underline">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-black font-bold hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.terms && (
              <p className="text-xs text-red-500 ml-8">{errors.terms}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <>
                <span
                  className="material-symbols-outlined animate-spin"
                  style={{ fontSize: "20px" }}
                >
                  refresh
                </span>
                Creating account...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  person_add
                </span>
                Create Account
              </>
            )}
          </Button>
        </form>

        <div className={divider()}>
          <div className={dividerLine()}></div>
          <span className={dividerText()}>Or</span>
        </div>

        <div className="space-y-3">
          <Button
            variant="secondary"
            className="w-full justify-center"
            onClick={() => {}}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
              login
            </span>
            Continue with Google
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-black font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

