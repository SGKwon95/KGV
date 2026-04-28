"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  const login = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    return result;
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const requireAuth = (redirectTo?: string) => {
    if (!isLoading && !isAuthenticated) {
      const loginUrl = redirectTo
        ? `/login?callbackUrl=${encodeURIComponent(redirectTo)}`
        : "/login";
      router.push(loginUrl);
      return false;
    }
    return true;
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    requireAuth,
  };
}
