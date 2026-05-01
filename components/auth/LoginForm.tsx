"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  loginId:  z.string().min(1, "아이디를 입력해주세요."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await login(data.loginId, data.password);
      router.push(callbackUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 rounded p-3 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-400 mb-1">아이디</label>
        <input
          {...register("loginId")}
          type="text"
          placeholder="아이디"
          autoComplete="username"
          className="w-full bg-kgv-gray text-white px-4 py-3 rounded border border-kgv-gray focus:border-kgv-red outline-none"
        />
        {errors.loginId && (
          <p className="text-red-400 text-xs mt-1">{errors.loginId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">비밀번호</label>
        <input
          {...register("password")}
          type="password"
          placeholder="비밀번호"
          autoComplete="current-password"
          className="w-full bg-kgv-gray text-white px-4 py-3 rounded border border-kgv-gray focus:border-kgv-red outline-none"
        />
        {errors.password && (
          <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "로그인 중..." : "로그인"}
      </button>

      <p className="text-center text-sm text-gray-400">
        아직 회원이 아닌가요?{" "}
        <Link href="/register" className="text-kgv-red hover:underline">
          회원가입
        </Link>
      </p>
    </form>
  );
}
