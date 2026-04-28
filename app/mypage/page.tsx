export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { BookingHistory } from "@/components/mypage/BookingHistory";
import { UserProfile } from "@/components/mypage/UserProfile";
import { MOCK_BOOKINGS } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "마이페이지",
};

// 로그인 없이도 볼 수 있도록 mock 유저 사용
const MOCK_USER = {
  id: "user-01",
  name: "홍길동",
  email: "hong@kgv.com",
  nickname: "영화광",
  phone: "010-1234-5678",
  image: null,
  point: 5000,
  createdAt: new Date("2024-01-01"),
};

export default function MyPage() {
  const bookings = MOCK_BOOKINGS.filter((b) => b.userId === MOCK_USER.id);

  return (
    <div className="container-main py-10">
      <h1 className="section-title">마이페이지</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <UserProfile user={MOCK_USER} />
        </div>
        <div className="lg:col-span-2">
          <BookingHistory bookings={bookings} />
        </div>
      </div>
    </div>
  );
}
