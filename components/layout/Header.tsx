"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, Film, Ticket, User } from "lucide-react";

const NAV_LINKS = [
  { href: "/movies?type=nowShowing", label: "현재상영", icon: Film },
  { href: "/movies?type=comingSoon", label: "개봉예정", icon: Film },
  { href: "/booking", label: "예매", icon: Ticket },
];

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-kgv-dark border-b border-kgv-gray sticky top-0 z-50">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link
            href="/"
            className="text-2xl font-black text-kgv-red tracking-wider"
          >
            KGV
          </Link>

          {/* 데스크탑 네비게이션 */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* 유저 메뉴 */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/mypage"
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <User size={16} />
                  {session.user?.name ?? "마이페이지"}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-sm py-2 px-4"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>

          {/* 모바일 햄버거 */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileOpen && (
        <div className="md:hidden bg-kgv-dark border-t border-kgv-gray">
          <div className="container-main py-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-300 hover:text-white py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-kgv-gray" />
            {session ? (
              <>
                <Link
                  href="/mypage"
                  className="block text-gray-300 hover:text-white py-2"
                >
                  마이페이지
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block text-gray-400 hover:text-white py-2"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-gray-300 hover:text-white py-2"
                >
                  로그인
                </Link>
                <Link href="/register" className="block text-kgv-red py-2">
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
