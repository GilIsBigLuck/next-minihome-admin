"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { Input, Button } from "@/components/ui";
import { authApi } from "@/lib/api/auth";

const loginContainer = cva(
  "min-h-screen bg-white flex items-center justify-center p-4"
);

const loginCard = cva(
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

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Store token if available
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      // Navigate to dashboard on success
      router.push("/");
    },
    onError: (error: Error) => {
      setErrors({
        password: error.message || "Login failed. Please check your credentials.",
      });
    },
  });

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    loginMutation.mutate({
      username: username.trim(),
      password,
    });
  };

  return (
    <div className={loginContainer()}>
      <div className={loginCard()}>
        <div className={logoContainer()}>
          <div className={logoIcon()}>A</div>
          <span className={logoText()}>
            Admin<span className="font-normal">Panel</span>
          </span>
        </div>

        <h1 className={title()}>Welcome Back</h1>
        <p className={subtitle()}>
          Sign in to access your admin dashboard
        </p>

        <form onSubmit={handleSubmit} className={form()}>
          <Input
            label="Username"
            icon="person"
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
            }}
            error={errors.password}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-black border-2 border-black rounded-none focus:ring-0 cursor-pointer"
              />
              <span className="text-gray-600 font-medium">Remember me</span>
            </label>
            <a
              href="#"
              className="text-black font-bold hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: "20px" }}>
                  refresh
                </span>
                Signing in...
              </>
            ) : (
              <>
                Sign In
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
          Don't have an account?{" "}
          <Link href="/register" className="text-black font-bold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

