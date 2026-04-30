import Link from "next/link";
import { Tag, Film, CalendarDays, Building2 } from "lucide-react";

const QUICK_LINKS = [
  {
    label: "가격 정책",
    description: "티켓 유형·관 타입·시간대별 요금 설정",
    href: "/admin/price-policy",
    icon: Tag,
    available: true,
  },
  {
    label: "영화 관리",
    description: "영화 등록·수정·상영 여부 관리",
    href: "/admin/movies",
    icon: Film,
    available: false,
  },
  {
    label: "상영 관리",
    description: "상영 스케줄·좌석 현황 관리",
    href: "/admin/screenings",
    icon: CalendarDays,
    available: false,
  },
  {
    label: "극장 관리",
    description: "극장·상영관 정보 관리",
    href: "/admin/theaters",
    icon: Building2,
    available: false,
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">대시보드</h1>
      <p className="text-gray-400 text-sm mb-8">KGV 관리자 센터에 오신 것을 환영합니다.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_LINKS.map((item) => {
          const Icon = item.icon;
          return item.available ? (
            <Link
              key={item.href}
              href={item.href}
              className="bg-kgv-gray rounded-lg p-5 hover:bg-kgv-gray/80 hover:ring-1 hover:ring-kgv-red transition group"
            >
              <div className="w-10 h-10 rounded-lg bg-kgv-red/10 flex items-center justify-center mb-4 group-hover:bg-kgv-red/20 transition">
                <Icon size={20} className="text-kgv-red" />
              </div>
              <p className="text-white font-semibold text-sm mb-1">{item.label}</p>
              <p className="text-gray-400 text-xs leading-relaxed">{item.description}</p>
            </Link>
          ) : (
            <div
              key={item.href}
              className="bg-kgv-gray/40 rounded-lg p-5 cursor-not-allowed"
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                <Icon size={20} className="text-gray-600" />
              </div>
              <p className="text-gray-600 font-semibold text-sm mb-1">{item.label}</p>
              <p className="text-gray-700 text-xs leading-relaxed">{item.description}</p>
              <span className="inline-block mt-3 text-xs text-gray-600 bg-kgv-gray px-2 py-0.5 rounded">
                준비중
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
