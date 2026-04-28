# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # 개발 서버 시작 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 실행

# Prisma (DB 연결 후 사용)
npm run db:generate  # Prisma Client 재생성
npm run db:push      # 스키마를 DB에 직접 반영 (개발용)
npm run db:migrate   # 마이그레이션 생성 및 실행
npm run db:studio    # Prisma Studio (DB GUI)
npm run db:seed      # 샘플 데이터 삽입 (prisma/seed.ts)
```

## 현재 개발 모드: DB 없는 Mock 모드

**DB 연결 없이 바로 실행 가능하다.** 모든 데이터는 `lib/mock-data.ts`에서 인메모리로 관리된다.

- 테스트 로그인: `hong@kgv.com` / `password123`
- 예매 데이터는 서버 재시작 시 초기화됨 (`MOCK_BOOKINGS` 배열)
- DB 연결을 원할 경우 `.env.local`의 `DATABASE_URL`을 설정하고 페이지/API에서 `MOCK_*` 대신 `prisma`로 교체

## 아키텍처

### 라우팅 (App Router)

```
app/
  page.tsx                     # 홈 (HeroBanner + NowShowing + ComingSoon + QuickBooking)
  movies/page.tsx              # 영화 목록 (필터/정렬)
  movies/[id]/page.tsx         # 영화 상세 + 리뷰
  booking/page.tsx             # 예매 (4단계 플로우, 로그인 불필요)
  booking/complete/page.tsx    # 예매 완료
  login/page.tsx               # 로그인
  register/page.tsx            # 회원가입
  mypage/page.tsx              # 예매 내역 + 프로필
  api/movies/route.ts          # GET /api/movies?type=&genre=&sort=&page=&limit=
  api/screenings/route.ts      # GET /api/screenings?movieId=&theaterId=&date=
  api/screenings/[id]/seats/   # GET /api/screenings/:id/seats
  api/bookings/route.ts        # POST /api/bookings
  api/auth/[...nextauth]/      # NextAuth.js 핸들러
  api/auth/register/           # POST /api/auth/register
```

모든 DB 조회 페이지는 `export const dynamic = "force-dynamic"` 선언 필수 (정적 빌드 시 DB 연결 시도 방지).

### 데이터 흐름

**Mock 모드 (현재):**
- 서버 컴포넌트 → `lib/mock-data.ts`의 `MOCK_*` 상수 직접 참조
- API 라우트 → 동일한 `MOCK_*` 데이터 반환
- 예매 생성 → `MOCK_BOOKINGS` 배열에 push (인메모리)

**DB 모드 (전환 시):**
- 서버 컴포넌트 → `lib/db.ts`의 `prisma` 클라이언트 사용
- `lib/db.ts`는 싱글턴 패턴으로 전역 `PrismaClient` 관리

### 상태 관리

- **예매 플로우 상태**: `hooks/useBooking.ts` — Zustand store. 선택 좌석, 스크리닝 ID, 총 금액 관리.
- **인증 상태**: `next-auth/react`의 `useSession()` 훅. `lib/auth.ts`에서 NextAuth 설정.
- **서버 상태**: 별도 캐싱 없음. API 호출은 `useEffect` + `fetch`.

### 예매 플로우 (4단계)

`components/booking/BookingFlow.tsx`가 오케스트레이터 역할:
1. `MovieStep` — 영화 선택
2. `ScheduleStep` — 날짜/극장/시간 선택 (`/api/screenings` 호출)
3. `SeatStep` — 좌석 선택 (`/api/screenings/:id/seats` 호출, useBookingStore에 저장)
4. `PaymentStep` — 티켓 유형 변경 + 결제 (`/api/bookings` POST)

### 핵심 유틸 (`lib/utils.ts`)

`cn()`, `formatPrice()`, `formatRuntime()`, `formatDate()`, `formatMovieRating()`, `getMovieRatingColor()` — 자주 사용되므로 중복 구현하지 말 것.

### 디자인 시스템

`tailwind.config.ts`의 `kgv.*` 컬러 팔레트를 사용. 커스텀 클래스는 `app/globals.css`에 정의:
- `.btn-primary` / `.btn-secondary` — 버튼
- `.card` — 카드 컨테이너
- `.section-title` — 섹션 제목
- `.container-main` — 최대 폭 + 중앙 정렬 래퍼

### Prisma 스키마 핵심 관계

```
User → Booking (1:N)
Movie → Screening (1:N) → Booking (1:N) → BookingSeat (1:N) → Seat
Theater → Hall → Seat
```

영화 등급: `ALL / TWELVE / FIFTEEN / ADULT`
상영관 타입: `STANDARD / IMAX / FOUR_DX / SCREEN_X / PREMIUM`
