# KGV 데이터베이스 스키마

> **DB**: Supabase (PostgreSQL)  
> **ORM**: Prisma  
> **최종 업데이트**: 2026-04-30

---

## 테이블 목록

| 테이블 | 설명 | 컬럼 수 |
|--------|------|---------|
| `users` | 회원 | 11 |
| `movies` | 영화 | 20 |
| `theaters` | 극장 | 9 |
| `halls` | 상영관 | 5 |
| `seats` | 좌석 | 5 |
| `screenings` | 상영 일정 | 9 |
| `bookings` | 예매 | 11 |
| `booking_seats` | 예매 좌석 (상세) | 5 |
| `reviews` | 리뷰 | 9 |

---

## 테이블 상세

### users
회원 계정 정보

| 컬럼 | 타입 | 기본값 | NULL | 설명 |
|------|------|--------|------|------|
| `id` | text | gen_random_uuid() | NO | **PK** |
| `email` | text | — | NO | 이메일 (UNIQUE) |
| `name` | text | — | YES | 이름 |
| `nickname` | text | — | YES | 닉네임 (UNIQUE) |
| `phone` | text | — | YES | 전화번호 |
| `password` | text | — | YES | bcrypt 해시 |
| `image` | text | — | YES | 프로필 이미지 URL |
| `role` | UserRole | `USER` | NO | 권한 |
| `point` | integer | `0` | NO | 포인트 잔액 |
| `createdAt` | timestamp | CURRENT_TIMESTAMP | NO | 가입일 |
| `updatedAt` | timestamp | CURRENT_TIMESTAMP | NO | 수정일 |

**테스트 계정**

| 이메일 | 비밀번호 | 권한 |
|--------|----------|------|
| hong@kgv.com | password123 | USER |
| test@kgv.com | password123 | USER |
| admin@kgv.com | admin1234 | ADMIN |

---

### movies
영화 정보

| 컬럼 | 타입 | 기본값 | NULL | 설명 |
|------|------|--------|------|------|
| `id` | text | gen_random_uuid() | NO | **PK** |
| `title` | text | — | NO | 제목 (한글) |
| `titleEn` | text | — | YES | 제목 (영문) |
| `synopsis` | text | — | YES | 줄거리 |
| `director` | text | — | YES | 감독 |
| `cast` | text | — | YES | 출연진 (JSON 문자열 배열) |
| `genre` | text | — | YES | 장르 (콤마 구분) |
| `rating` | MovieRating | `ALL` | NO | 관람 등급 |
| `runtime` | integer | — | YES | 상영 시간 (분) |
| `releaseDate` | timestamp | — | YES | 개봉일 |
| `posterUrl` | text | — | YES | 포스터 이미지 URL |
| `backdropUrl` | text | — | YES | 배경 이미지 URL |
| `trailerUrl` | text | — | YES | 예고편 URL |
| `tmdbId` | text | — | YES | TMDB ID (UNIQUE) |
| `isNowShowing` | boolean | `false` | NO | 현재 상영 여부 |
| `isComingSoon` | boolean | `false` | NO | 개봉 예정 여부 |
| `avgScore` | float8 | `0` | NO | 평균 평점 |
| `bookingRate` | float8 | `0` | NO | 예매율 (%) |
| `createdAt` | timestamp | CURRENT_TIMESTAMP | NO | 등록일 |
| `updatedAt` | timestamp | CURRENT_TIMESTAMP | NO | 수정일 |

**현재 상영작 (isNowShowing = true)**

| ID | 제목 | 등급 | 런타임 |
|----|------|------|--------|
| movie-07 | 프로젝트 헤일메리 | TWELVE | 156분 |
| movie-08 | 슈퍼 마리오 갤럭시 | ALL | 98분 |
| movie-09 | 살목지 | FIFTEEN | 95분 |
| movie-10 | 악마는 프라다를 입는다 2 | TWELVE | 118분 |
| movie-11 | 극장판 짱구는 못말려 | ALL | 105분 |

---

### theaters
극장 정보

| 컬럼 | 타입 | 기본값 | NULL | 설명 |
|------|------|--------|------|------|
| `id` | text | gen_random_uuid() | NO | **PK** |
| `name` | text | — | NO | 극장명 |
| `region` | text | — | NO | 지역 (서울, 경기, 부산 등) |
| `address` | text | — | YES | 주소 |
| `phone` | text | — | YES | 대표 전화 |
| `latitude` | float8 | — | YES | 위도 |
| `longitude` | float8 | — | YES | 경도 |
| `createdAt` | timestamp | CURRENT_TIMESTAMP | NO | 등록일 |
| `updatedAt` | timestamp | CURRENT_TIMESTAMP | NO | 수정일 |

**등록된 극장**

| ID | 극장명 | 지역 |
|----|--------|------|
| theater-01 | KGV 강남 | 서울 |
| theater-02 | KGV 홍대 | 서울 |
| theater-03 | KGV 부산서면 | 부산 |
| theater-04 | KGV 수원 | 경기 |

---

### halls
상영관 정보 (theaters에 종속)

| 컬럼 | 타입 | 기본값 | NULL | 설명 |
|------|------|--------|------|------|
| `id` | text | gen_random_uuid() | NO | **PK** |
| `theaterId` | text | — | NO | **FK** → theaters.id |
| `name` | text | — | NO | 상영관명 (1관, IMAX관 등) |
| `hallType` | HallType | `STANDARD` | NO | 상영관 유형 |
| `totalSeats` | integer | — | NO | 총 좌석 수 |

**등록된 상영관**

| ID | 극장 | 관명 | 유형 | 좌석 |
|----|------|------|------|------|
| hall-01 | KGV 강남 | 1관 | STANDARD | 100 |
| hall-02 | KGV 강남 | 2관 | STANDARD | 100 |
| hall-03 | KGV 강남 | IMAX관 | IMAX | 100 |
| hall-04 | KGV 홍대 | 1관 | STANDARD | 100 |
| hall-05 | KGV 홍대 | 2관 | STANDARD | 100 |
| hall-06 | KGV 부산서면 | 1관 | STANDARD | 100 |
| hall-07 | KGV 수원 | 1관 | STANDARD | 100 |

---

### seats
좌석 정보 (halls에 종속)

| 컬럼 | 타입 | 기본값 | NULL | 설명 |
|------|------|--------|------|------|
| `id` | text | gen_random_uuid() | NO | **PK** |
| `hallId` | text | — | NO | **FK** → halls.id |
| `row` | text | — | NO | 행 (A~J) |
| `number` | integer | — | NO | 열 (1~10) |
| `seatType` | SeatType | `STANDARD` | NO | 좌석 유형 |

- UNIQUE 제약: `(hallId, row, number)`
- 총 700석 (7개 관 × 100석)
- 좌석 구성: A~J행 × 1~10열

---

### screenings
상영 일정

| 컬럼 | 타입 | 기본값 | NULL | 설명 |
|------|------|--------|------|------|
| `id` | text | gen_random_uuid() | NO | **PK** |
| `movieId` | text | — | NO | **FK** → movies.id |
| `hallId` | text | — | NO | **FK** → halls.id |
| `startTime` | timestamp | — | NO | 상영 시작 시각 |
| `endTime` | timestamp | — | NO | 상영 종료 시각 |
| `price` | integer | — | NO | 기본 가격 (원) |
| `status` | ScreeningStatus | `SCHEDULED` | NO | 상영 상태 |
| `createdAt` | timestamp | CURRENT_TIMESTAMP | NO | 등록일 |
| `updatedAt` | timestamp | CURRENT_TIMESTAMP | NO | 수정일 |

**상영 스케줄 구성**
- 기간: 오늘 기준 7일
- 회차: 하루 4회 (10:00 / 13:00 / 16:00 / 19:00)
- 상영관-영화 매핑:

| 상영관 | 영화 | 기본가 |
|--------|------|--------|
| hall-01 (강남 1관) | 프로젝트 헤일메리 | 15,000원 |
| hall-02 (강남 2관) | 악마는 프라다를 입는다 2 | 15,000원 |
| hall-03 (강남 IMAX) | 슈퍼 마리오 갤럭시 | 18,000원 |
| hall-04 (홍대 1관) | 살목지 | 15,000원 |
| hall-05 (홍대 2관) | 극장판 짱구는 못말려 | 15,000원 |
| hall-06 (부산서면 1관) | 프로젝트 헤일메리 | 15,000원 |
| hall-07 (수원 1관) | 악마는 프라다를 입는다 2 | 15,000원 |

---

### bookings
예매 내역

| 컬럼 | 타입 | 기본값 | NULL | 설명 |
|------|------|--------|------|------|
| `id` | text | gen_random_uuid() | NO | **PK** |
| `bookingNumber` | text | gen_random_uuid() | NO | 예매 번호 (UNIQUE) |
| `userId` | text | — | NO | **FK** → users.id |
| `screeningId` | text | — | NO | **FK** → screenings.id |
| `totalPrice` | integer | — | NO | 총 결제 금액 |
| `status` | BookingStatus | `PENDING` | NO | 예매 상태 |
| `paymentMethod` | text | — | YES | 결제 수단 |
| `paymentId` | text | — | YES | 결제 트랜잭션 ID |
| `bookedAt` | timestamp | CURRENT_TIMESTAMP | NO | 예매 시각 |
| `cancelledAt` | timestamp | — | YES | 취소 시각 |
| `updatedAt` | timestamp | CURRENT_TIMESTAMP | NO | 수정일 |

---

### booking_seats
예매별 좌석 상세 (bookings + seats 연결)

| 컬럼 | 타입 | 기본값 | NULL | 설명 |
|------|------|--------|------|------|
| `id` | text | gen_random_uuid() | NO | **PK** |
| `bookingId` | text | — | NO | **FK** → bookings.id |
| `seatId` | text | — | NO | **FK** → seats.id |
| `ticketType` | TicketType | `ADULT` | NO | 티켓 유형 |
| `price` | integer | — | NO | 좌석 단가 |

- UNIQUE 제약: `(bookingId, seatId)`

---

### reviews
영화 리뷰

| 컬럼 | 타입 | 기본값 | NULL | 설명 |
|------|------|--------|------|------|
| `id` | text | gen_random_uuid() | NO | **PK** |
| `userId` | text | — | NO | **FK** → users.id |
| `movieId` | text | — | NO | **FK** → movies.id |
| `score` | float8 | — | NO | 평점 (0.5 ~ 5.0) |
| `content` | text | — | YES | 리뷰 내용 |
| `isSpoiler` | boolean | `false` | NO | 스포일러 여부 |
| `likes` | integer | `0` | NO | 좋아요 수 |
| `createdAt` | timestamp | CURRENT_TIMESTAMP | NO | 작성일 |
| `updatedAt` | timestamp | CURRENT_TIMESTAMP | NO | 수정일 |

- UNIQUE 제약: `(userId, movieId)` — 1인 1리뷰

---

## 관계도

```
users ─────────────────── bookings ──── booking_seats ──── seats
                             │                                │
                          screenings                        halls ──── theaters
                             │
                           movies ──── reviews ──── users
```

```
theaters (1) ──── (N) halls (1) ──── (N) seats
halls    (1) ──── (N) screenings
movies   (1) ──── (N) screenings
users    (1) ──── (N) bookings  (1) ──── (N) booking_seats
screenings (1) ── (N) bookings
seats    (1) ──── (N) booking_seats
users    (1) ──── (N) reviews
movies   (1) ──── (N) reviews
```

---

## Enum 목록

| Enum | 값 |
|------|----|
| `UserRole` | USER, ADMIN |
| `MovieRating` | ALL, TWELVE, FIFTEEN, ADULT |
| `HallType` | STANDARD, IMAX, FOUR_DX, SCREEN_X, PREMIUM |
| `SeatType` | STANDARD, PREMIUM, COUPLE, WHEELCHAIR |
| `ScreeningStatus` | SCHEDULED, ONGOING, ENDED, CANCELLED |
| `BookingStatus` | PENDING, CONFIRMED, CANCELLED, REFUNDED |
| `TicketType` | ADULT, TEEN, CHILD, SENIOR, DISABLED |
