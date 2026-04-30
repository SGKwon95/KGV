"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Tag,
  Film,
  CalendarDays,
  Building2,
  Users,
  ChevronRight,
} from "lucide-react";

const ADMIN_NAV = [
  {
    label: "대시보드",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "가격 정책",
    href: "/admin/price-policy",
    icon: Tag,
  },
  {
    label: "영화 관리",
    href: "/admin/movies",
    icon: Film,
    disabled: true,
  },
  {
    label: "상영 관리",
    href: "/admin/screenings",
    icon: CalendarDays,
    disabled: true,
  },
  {
    label: "극장 관리",
    href: "/admin/theaters",
    icon: Building2,
    disabled: true,
  },
  {
    label: "회원 관리",
    href: "/admin/users",
    icon: Users,
    disabled: true,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex">
      {/* 사이드바 */}
      <aside className="w-60 shrink-0 bg-kgv-dark border-r border-kgv-gray flex flex-col">
        {/* 로고 영역 */}
        <div className="h-16 flex items-center px-6 border-b border-kgv-gray">
          <Link href="/" className="text-xl font-black text-kgv-red tracking-wider">
            KGV
          </Link>
          <span className="ml-2 text-xs text-gray-500 font-medium bg-kgv-gray px-2 py-0.5 rounded">
            ADMIN
          </span>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-0.5 px-2">
            {ADMIN_NAV.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  {item.disabled ? (
                    <span className="flex items-center gap-3 px-3 py-2.5 rounded text-gray-600 cursor-not-allowed text-sm">
                      <Icon size={16} />
                      {item.label}
                      <span className="ml-auto text-xs text-gray-700">준비중</span>
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                        isActive
                          ? "bg-kgv-red text-white font-semibold"
                          : "text-gray-400 hover:text-white hover:bg-kgv-gray"
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                      {isActive && <ChevronRight size={14} className="ml-auto" />}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 하단 링크 */}
        <div className="px-4 py-4 border-t border-kgv-gray">
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← 사이트로 돌아가기
          </Link>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 상단 바 */}
        <header className="h-16 bg-kgv-dark border-b border-kgv-gray flex items-center px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>관리자</span>
            <ChevronRight size={14} />
            <span className="text-white">
              {ADMIN_NAV.find((n) =>
                n.exact ? pathname === n.href : pathname.startsWith(n.href)
              )?.label ?? ""}
            </span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
