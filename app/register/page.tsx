import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "회원가입",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-kgv-red">KGV</h1>
          <p className="text-gray-400 mt-2">KGV 회원이 되어 다양한 혜택을 누리세요</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
