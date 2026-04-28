"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(2, "이름은 2자 이상이어야 합니다."),
    email: z.string().email("올바른 이메일을 입력해주세요."),
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
    confirmPassword: z.string(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "회원가입에 실패했습니다.");
      }

      router.push("/login?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 rounded p-3 text-sm">
          {error}
        </div>
      )}

      {[
        { name: "name" as const, label: "이름", type: "text", placeholder: "이름" },
        { name: "email" as const, label: "이메일", type: "email", placeholder: "이메일 주소" },
        { name: "password" as const, label: "비밀번호", type: "password", placeholder: "8자 이상" },
        { name: "confirmPassword" as const, label: "비밀번호 확인", type: "password", placeholder: "비밀번호 재입력" },
        { name: "phone" as const, label: "휴대폰 번호 (선택)", type: "tel", placeholder: "010-0000-0000" },
      ].map((field) => (
        <div key={field.name}>
          <label className="block text-sm text-gray-400 mb-1">{field.label}</label>
          <input
            {...register(field.name)}
            type={field.type}
            placeholder={field.placeholder}
            className="w-full bg-kgv-gray text-white px-4 py-3 rounded border border-kgv-gray focus:border-kgv-red outline-none"
          />
          {errors[field.name] && (
            <p className="text-red-400 text-xs mt-1">{errors[field.name]?.message}</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "가입 중..." : "회원가입"}
      </button>

      <p className="text-center text-sm text-gray-400">
        이미 회원이신가요?{" "}
        <Link href="/login" className="text-kgv-red hover:underline">
          로그인
        </Link>
      </p>
    </form>
  );
}
