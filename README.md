# KGV 영화관

CGV를 벤치마킹한 영화 예매 웹서비스입니다.

**Tech Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS · Prisma ORM · MySQL · NextAuth.js

---

## 시작하기

```bash
npm install
npm run dev   # http://localhost:3000
```

DB 없이 Mock 데이터로 바로 실행됩니다.  
테스트 계정: `hong@kgv.com` / `password123`

---

## 주요 기능

- 현재상영 · 개봉예정 영화 목록 및 상세
- 영화 → 날짜/시간 → 좌석 → 결제 4단계 예매 플로우
- 예매 내역 조회 (마이페이지)
- 회원가입 / 로그인 (NextAuth.js)

---

## DB 연결 (MySQL)

`.env.example`을 참고해 `.env.local` 설정 후:

```bash
npm run db:migrate   # 마이그레이션 실행
npm run db:seed      # 샘플 데이터 삽입
npm run db:studio    # Prisma Studio (GUI)
```

---

## 환경 변수

| 변수 | 설명 |
|------|------|
| `DATABASE_URL` | MySQL 연결 문자열 |
| `NEXTAUTH_SECRET` | NextAuth 서명 키 |
| `NEXTAUTH_URL` | 앱 URL (배포 시 필수) |

전체 목록은 `.env.example` 참고.

---

## 배포 (Vercel)

1. Vercel에 레포지토리 연결
2. Environment Variables에 `.env.example` 항목 입력
3. `DATABASE_URL`은 PlanetScale · Railway · Supabase 등 외부 MySQL 사용

---

## 프로젝트 구조

```
app/          # 페이지 및 API 라우트 (App Router)
components/   # UI 컴포넌트
lib/          # db, auth, utils, mock-data
hooks/        # useBooking (Zustand), useAuth, useMovies
types/        # 공통 타입 정의
prisma/       # 스키마 및 시드 데이터
```
