// ================================
// KGV - Mock Data (DB 없이 개발용)
// ================================

export const MOCK_MOVIES = [
  {
    id: "movie-01",
    title: "인터스텔라",
    titleEn: "Interstellar",
    synopsis:
      "우주를 넘어 인류의 생존을 건 여정. 지구가 황폐해지며 인류가 멸종 위기에 처한 미래, 전직 NASA 파일럿 쿠퍼는 남겨진 가족들을 위해 새로운 터전을 찾는 마지막 임무에 자원한다.",
    director: "크리스토퍼 놀란",
    cast: JSON.stringify(["매튜 맥커너히", "앤 해서웨이", "제시카 차스테인"]),
    genre: "SF,드라마,어드벤처",
    rating: "TWELVE",
    runtime: 169,
    releaseDate: new Date("2014-11-06"),
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIE.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    tmdbId: "157336",
    isNowShowing: true,
    isComingSoon: false,
    avgScore: 4.8,
    bookingRate: 32.5,
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { reviews: 1284 },
  },
  {
    id: "movie-02",
    title: "어벤져스: 엔드게임",
    titleEn: "Avengers: Endgame",
    synopsis:
      "타노스의 핑거스냅으로 절반의 생명이 사라진 지 5년 후, 남겨진 어벤져스는 마지막 희망을 걸고 시간 여행을 통해 인피니티 스톤을 되찾으려 한다.",
    director: "안소니 루소, 조 루소",
    cast: JSON.stringify(["로버트 다우니 주니어", "크리스 에반스", "마크 러팔로"]),
    genre: "액션,SF,어드벤처",
    rating: "TWELVE",
    runtime: 181,
    releaseDate: new Date("2019-04-24"),
    posterUrl: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
    tmdbId: "299534",
    isNowShowing: true,
    isComingSoon: false,
    avgScore: 4.6,
    bookingRate: 28.1,
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { reviews: 2103 },
  },
  {
    id: "movie-03",
    title: "듄: 파트 2",
    titleEn: "Dune: Part Two",
    synopsis:
      "폴 아트레이데스가 프레멘 전사 차니 및 레토 공작 부인과 연합해 자신의 가족을 파괴한 자들에게 복수하는 신화적 여정을 그린 작품.",
    director: "드니 빌뇌브",
    cast: JSON.stringify(["티모시 샬라메", "제나야", "레베카 퍼거슨"]),
    genre: "SF,어드벤처,드라마",
    rating: "TWELVE",
    runtime: 166,
    releaseDate: new Date("2024-02-28"),
    posterUrl: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
    tmdbId: "693134",
    isNowShowing: true,
    isComingSoon: false,
    avgScore: 4.5,
    bookingRate: 19.4,
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { reviews: 876 },
  },
  {
    id: "movie-04",
    title: "오펜하이머",
    titleEn: "Oppenheimer",
    synopsis:
      "원자폭탄의 아버지 J. 로버트 오펜하이머의 삶을 조명한 작품. 세계를 구하기 위해 세계를 파괴할 수 있는 무기를 만들어야 했던 한 인간의 이야기.",
    director: "크리스토퍼 놀란",
    cast: JSON.stringify(["킬리언 머피", "에밀리 블런트", "맷 데이먼"]),
    genre: "드라마,전기,역사",
    rating: "FIFTEEN",
    runtime: 180,
    releaseDate: new Date("2023-08-15"),
    posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    tmdbId: "872585",
    isNowShowing: true,
    isComingSoon: false,
    avgScore: 4.7,
    bookingRate: 15.2,
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { reviews: 1541 },
  },
  {
    id: "movie-05",
    title: "범죄도시 4",
    titleEn: "The Roundup: Punishment",
    synopsis:
      "마석도 형사가 이번엔 가상자산 범죄 조직을 소탕하러 나선다. 국내외를 넘나들며 펼쳐지는 액션 블록버스터.",
    director: "허명행",
    cast: JSON.stringify(["마동석", "김무열", "박지환"]),
    genre: "액션,범죄",
    rating: "FIFTEEN",
    runtime: 109,
    releaseDate: new Date("2024-04-24"),
    posterUrl: "https://image.tmdb.org/t/p/w500/cVhqHFzMsHzsqUvpjC2pHM4jvC9.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/4XM8DUTQb3lhoweFBDvwmIFBFAWq.jpg",
    trailerUrl: null,
    tmdbId: "1087822",
    isNowShowing: true,
    isComingSoon: false,
    avgScore: 4.2,
    bookingRate: 22.3,
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { reviews: 432 },
  },
  {
    id: "movie-06",
    title: "인사이드 아웃 2",
    titleEn: "Inside Out 2",
    synopsis:
      "라일리의 마음 속에 새로운 감정들이 등장하며 기쁨이와 친구들이 새로운 모험을 펼치는 픽사의 감동 애니메이션.",
    director: "켈시 만",
    cast: JSON.stringify(["에이미 포엘러", "마야 호크"]),
    genre: "애니메이션,가족,코미디",
    rating: "ALL",
    runtime: 100,
    releaseDate: new Date("2024-06-12"),
    posterUrl: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/xg27NrXi7VXCGUr7MG75UqLl6Vg.jpg",
    trailerUrl: null,
    tmdbId: "1022789",
    isNowShowing: false,
    isComingSoon: true,
    avgScore: 4.3,
    bookingRate: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { reviews: 0 },
  },
  {
    id: "movie-07",
    title: "데드풀과 울버린",
    titleEn: "Deadpool & Wolverine",
    synopsis:
      "MCU에 합류한 데드풀이 울버린을 강제로 끌어들이며 멀티버스의 위기를 해결하는 마블 최초 R등급 영화.",
    director: "숀 레비",
    cast: JSON.stringify(["라이언 레이놀즈", "휴 잭맨"]),
    genre: "액션,SF,코미디",
    rating: "FIFTEEN",
    runtime: 127,
    releaseDate: new Date("2024-07-24"),
    posterUrl: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
    trailerUrl: null,
    tmdbId: "533535",
    isNowShowing: false,
    isComingSoon: true,
    avgScore: 0,
    bookingRate: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { reviews: 0 },
  },
  {
    id: "movie-08",
    title: "에이리언: 로물루스",
    titleEn: "Alien: Romulus",
    synopsis:
      "우주 정거장을 탐사하던 젊은 우주 탐험가들이 우주에서 가장 무서운 생명체와 맞닥뜨리는 공포 SF 영화.",
    director: "페데 알바레즈",
    cast: JSON.stringify(["케일리 스패니"],),
    genre: "SF,공포,스릴러",
    rating: "FIFTEEN",
    runtime: 119,
    releaseDate: new Date("2024-08-14"),
    posterUrl: "https://image.tmdb.org/t/p/w500/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/9SSEUrSqhljBMzRe4aBTh17rUaC.jpg",
    trailerUrl: null,
    tmdbId: "945961",
    isNowShowing: false,
    isComingSoon: true,
    avgScore: 0,
    bookingRate: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { reviews: 0 },
  },
];

export const MOCK_THEATERS = [
  {
    id: "theater-01",
    name: "KGV 강남",
    region: "서울",
    address: "서울특별시 강남구 강남대로 지하 396",
    phone: "1544-1122",
    latitude: 37.4979,
    longitude: 127.0276,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "theater-02",
    name: "KGV 홍대",
    region: "서울",
    address: "서울특별시 마포구 양화로 188",
    phone: "1544-1122",
    latitude: 37.5574,
    longitude: 126.9242,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "theater-03",
    name: "KGV 부산서면",
    region: "부산",
    address: "부산광역시 부산진구 서면문화로 27",
    phone: "1544-1122",
    latitude: 35.1577,
    longitude: 129.0595,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "theater-04",
    name: "KGV 수원",
    region: "경기",
    address: "경기도 수원시 팔달구 권선로 780",
    phone: "1544-1122",
    latitude: 37.2636,
    longitude: 127.0286,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const MOCK_HALLS = [
  { id: "hall-01", theaterId: "theater-01", name: "1관", hallType: "STANDARD", totalSeats: 100 },
  { id: "hall-02", theaterId: "theater-01", name: "2관 IMAX", hallType: "IMAX", totalSeats: 150 },
  { id: "hall-03", theaterId: "theater-01", name: "3관", hallType: "STANDARD", totalSeats: 80 },
  { id: "hall-04", theaterId: "theater-02", name: "1관", hallType: "STANDARD", totalSeats: 90 },
  { id: "hall-05", theaterId: "theater-02", name: "2관", hallType: "STANDARD", totalSeats: 90 },
  { id: "hall-06", theaterId: "theater-03", name: "1관", hallType: "STANDARD", totalSeats: 120 },
  { id: "hall-07", theaterId: "theater-04", name: "1관", hallType: "STANDARD", totalSeats: 100 },
];

// 오늘 기준으로 동적 생성
function generateScreenings() {
  const screenings = [];
  const now = new Date();

  const schedules = [
    { movieId: "movie-01", hallId: "hall-01", times: ["10:00", "13:10", "16:20", "19:30", "22:00"] },
    { movieId: "movie-02", hallId: "hall-02", times: ["11:00", "14:30", "18:00", "21:30"] },
    { movieId: "movie-03", hallId: "hall-03", times: ["10:30", "13:30", "16:30", "19:30"] },
    { movieId: "movie-04", hallId: "hall-04", times: ["11:00", "14:30", "18:00", "21:00"] },
    { movieId: "movie-05", hallId: "hall-05", times: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
    { movieId: "movie-01", hallId: "hall-06", times: ["10:00", "13:10", "16:20", "19:30"] },
    { movieId: "movie-02", hallId: "hall-07", times: ["11:00", "14:30", "18:00"] },
  ];

  const movieRuntimes: Record<string, number> = {
    "movie-01": 169,
    "movie-02": 181,
    "movie-03": 166,
    "movie-04": 180,
    "movie-05": 109,
  };

  let idx = 0;
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    for (const s of schedules) {
      for (const time of s.times) {
        const [h, m] = time.split(":").map(Number);
        const start = new Date(now);
        start.setDate(start.getDate() + dayOffset);
        start.setHours(h, m, 0, 0);

        const runtime = movieRuntimes[s.movieId] ?? 120;
        const end = new Date(start.getTime() + runtime * 60 * 1000);

        const hall = MOCK_HALLS.find((hall) => hall.id === s.hallId)!;
        const theater = MOCK_THEATERS.find((t) => t.id === hall.theaterId)!;

        screenings.push({
          id: `screening-${idx++}`,
          movieId: s.movieId,
          hallId: s.hallId,
          startTime: start,
          endTime: end,
          price: hall.hallType === "IMAX" ? 18000 : 15000,
          status: "SCHEDULED",
          createdAt: new Date(),
          updatedAt: new Date(),
          hall: {
            ...hall,
            theater,
          },
          movie: MOCK_MOVIES.find((mv) => mv.id === s.movieId)!,
          _count: { bookings: Math.floor(Math.random() * 30) },
        });
      }
    }
  }
  return screenings;
}

export const MOCK_SCREENINGS = generateScreenings();

// 좌석 생성 (A~J행, 1~10번)
export function generateSeats(hallId: string) {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const seats = [];
  for (const row of rows) {
    for (let num = 1; num <= 10; num++) {
      seats.push({
        id: `seat-${hallId}-${row}${num}`,
        hallId,
        row,
        number: num,
        seatType: "STANDARD",
      });
    }
  }
  return seats;
}

export const MOCK_REVIEWS = [
  {
    id: "review-01",
    userId: "user-01",
    movieId: "movie-01",
    score: 5.0,
    content: "우주의 광활함과 인간의 감정이 완벽하게 어우러진 작품. 볼 때마다 새로운 감동이 있어요.",
    isSpoiler: false,
    likes: 124,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date(),
    user: { name: "별빛영화인", image: null },
  },
  {
    id: "review-02",
    userId: "user-02",
    movieId: "movie-01",
    score: 4.5,
    content: "놀란 감독의 연출과 한스 짐머의 음악이 압도적입니다. IMAX로 다시 보고 싶은 영화.",
    isSpoiler: false,
    likes: 89,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date(),
    user: { name: "무비러버", image: null },
  },
  {
    id: "review-03",
    userId: "user-03",
    movieId: "movie-02",
    score: 4.5,
    content: "11년간의 MCU 여정의 완벽한 피날레. 엔드크레딧 없이 극장을 나오는 관객들의 감동이 느껴졌습니다.",
    isSpoiler: false,
    likes: 203,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date(),
    user: { name: "마블팬", image: null },
  },
];

// 인메모리 예매 저장소 (서버 재시작 시 초기화)
export const MOCK_BOOKINGS: MockBooking[] = [];

export interface MockBooking {
  id: string;
  bookingNumber: string;
  userId: string;
  screeningId: string;
  totalPrice: number;
  status: string;
  paymentMethod?: string;
  bookedAt: Date;
  cancelledAt?: Date;
  updatedAt: Date;
  screening: (typeof MOCK_SCREENINGS)[0];
  bookingSeats: {
    id: string;
    bookingId: string;
    seatId: string;
    ticketType: string;
    price: number;
    seat: { row: string; number: number; seatType: string };
  }[];
}
