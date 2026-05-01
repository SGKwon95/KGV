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

## 현재 개발 모드: Prisma DB 모드

**PostgreSQL DB 연결이 필요하다.** 모든 데이터는 Prisma를 통해 DB에서 관리된다.

### DB 초기 설정 절차

```bash
# 1. .env.local에 DATABASE_URL 설정 (postgresql://user:password@host:port/db_name)
# 2. DB 스키마 반영
npm run db:push
# 3. 샘플 데이터 삽입
npm run db:seed
# 4. 개발 서버 실행
npm run dev
```

- 테스트 계정: `hong@kgv.com` / `password123`
- 예매 완료(`/api/bookings` POST)는 로그인 필수 — 세션 없으면 401 반환
- 마이페이지는 로그인하지 않으면 `/login`으로 리다이렉트됨

## 아키텍처

### 라우팅 (App Router)

```
app/
  page.tsx                     # 홈 (HeroBanner + NowShowing + ComingSoon + QuickBooking)
  movies/page.tsx              # 영화 목록 (필터/정렬)
  movies/[id]/page.tsx         # 영화 상세 + 리뷰
  booking/page.tsx             # 예매 (4단계 플로우)
  booking/complete/page.tsx    # 예매 완료
  login/page.tsx               # 로그인
  register/page.tsx            # 회원가입
  mypage/page.tsx              # 예매 내역 + 프로필
  admin/page.tsx               # 관리자 대시보드
  admin/price-policy/page.tsx  # 가격 정책 편집 (현재 UI-only, DB 미연동)
  api/movies/route.ts          # GET /api/movies?type=&genre=&sort=&page=&limit=
  api/screenings/route.ts      # GET /api/screenings?movieId=&theaterId=&date=
  api/screenings/[id]/seats/   # GET /api/screenings/:id/seats
  api/bookings/route.ts        # POST /api/bookings (로그인 필수)
  api/auth/[...nextauth]/      # NextAuth.js 핸들러
  api/auth/register/           # POST /api/auth/register
  api/debug/                   # 개발용 디버그 엔드포인트
```

모든 DB 조회 페이지는 `export const dynamic = "force-dynamic"` 선언 필수 (정적 빌드 시 DB 연결 시도 방지).

### 데이터 흐름

- 서버 컴포넌트 → `lib/db.ts`의 `prisma` 클라이언트 사용
- API 라우트 → 동일한 `prisma` 클라이언트로 DB 조회/쓰기
- `lib/db.ts`는 싱글턴 패턴으로 전역 `PrismaClient` 관리

### 상태 관리

- **예매 플로우 상태**: `hooks/useBooking.ts` — Zustand store (`useBookingStore`). 선택 좌석, 스크리닝 ID, 총 금액 관리.
- **인증 상태**: `next-auth/react`의 `useSession()` 훅. `lib/auth.ts`에서 NextAuth 설정 (Credentials Provider만 사용, JWT 세션).
- **서버 상태**: 별도 캐싱 없음. API 호출은 `useEffect` + `fetch`.

### 예매 플로우 (4단계)

`components/booking/BookingFlow.tsx`가 오케스트레이터 역할. 좌석 선택까지는 비로그인 가능, 결제 단계(`/api/bookings` POST) 시 로그인 확인:
1. `MovieStep` — 영화 선택
2. `ScheduleStep` — 날짜/극장/시간 선택 (`/api/screenings` 호출)
3. `SeatStep` — 좌석 선택 (`/api/screenings/:id/seats` 호출, `useBookingStore`에 저장)
4. `PaymentStep` — 티켓 유형 변경 + 결제 (`/api/bookings` POST)

### 핵심 유틸 (`lib/utils.ts`)

`cn()`, `formatPrice()`, `formatRuntime()`, `formatDate()`, `formatMovieRating()`, `getMovieRatingColor()`, `generateBookingNumber()` — 자주 사용되므로 중복 구현하지 말 것.

### 타입 시스템

- `types/index.ts` — Prisma 생성 타입을 re-export하고, `ApiResponse<T>`, `PaginatedResponse<T>`, `MovieWithReviews`, `ScreeningWithDetails`, `BookingWithDetails`, `SeatSelection`, `TICKET_PRICES`, `TICKET_TYPE_LABELS` 등 UI 전용 타입을 정의.
- Prisma 타입과 UI 타입이 충돌할 경우 `types/index.ts`를 먼저 확인할 것.

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
Movie → Review (1:N) ← User
```

주요 Enum 값:
- `UserRole`: `USER / ADMIN`
- `MovieRating`: `ALL / TWELVE / FIFTEEN / ADULT`
- `HallType`: `STANDARD / IMAX / FOUR_DX / SCREEN_X / PREMIUM`
- `TicketType`: `ADULT / TEEN / CHILD / SENIOR / DISABLED`
- `BookingStatus`: `PENDING / CONFIRMED / CANCELLED / REFUNDED`

### 관리자 페이지 (`/admin`)

사이드바 레이아웃(`app/admin/layout.tsx`)을 공유. 현재 구현된 메뉴는 가격 정책뿐이며, 영화·상영·극장·회원 관리는 "준비중" 상태. **가격 정책 저장은 아직 DB와 미연동** (UI 상태만 변경, TODO 주석 있음). 관리자 접근 제어 미들웨어가 없으므로 URL 직접 접근 가능 상태.
