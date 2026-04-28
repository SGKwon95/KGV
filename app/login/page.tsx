import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "로그인",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-kgv-red">KGV</h1>
          <p className="text-gray-400 mt-2">로그인하여 영화를 예매하세요</p>
        </div>
        <Suspense fallback={<div className="text-center text-gray-400">불러오는 중...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
