import {
  PrismaClient,
  MovieRating,
  HallType,
  SeatType,
  ScreeningStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ================================
  // 테스트 유저
  // ================================
  const hashedPassword = await bcrypt.hash("password123", 12);

  await prisma.user.upsert({
    where: { email: "hong@kgv.com" },
    update: {},
    create: {
      id: "user-01",
      name: "홍길동",
      email: "hong@kgv.com",
      password: hashedPassword,
      nickname: "영화광",
      phone: "010-1234-5678",
      point: 5000,
    },
  });

  await prisma.user.upsert({
    where: { email: "test@kgv.com" },
    update: {},
    create: {
      id: "user-02",
      name: "테스트유저",
      email: "test@kgv.com",
      password: hashedPassword,
      point: 0,
    },
  });

  // ================================
  // 극장 / 상영관 / 좌석
  // ================================
  const theaters = [
    {
      id: "theater-01",
      name: "KGV 강남",
      region: "서울",
      address: "서울특별시 강남구 강남대로 지하 396",
      phone: "1544-1122",
      latitude: 37.4979,
      longitude: 127.0276,
    },
    {
      id: "theater-02",
      name: "KGV 홍대",
      region: "서울",
      address: "서울특별시 마포구 양화로 188",
      phone: "1544-1133",
      latitude: 37.5563,
      longitude: 126.9237,
    },
    {
      id: "theater-03",
      name: "KGV 부산서면",
      region: "부산",
      address: "부산광역시 부산진구 서면문화로 27",
      phone: "1544-1144",
      latitude: 35.1579,
      longitude: 129.0597,
    },
    {
      id: "theater-04",
      name: "KGV 수원",
      region: "경기",
      address: "경기도 수원시 팔달구 인계로 178",
      phone: "1544-1155",
      latitude: 37.2636,
      longitude: 127.0286,
    },
  ];

  for (const theater of theaters) {
    await prisma.theater.upsert({
      where: { id: theater.id },
      update: {},
      create: theater,
    });
  }

  const halls = [
    { id: "hall-01", theaterId: "theater-01", name: "1관", hallType: HallType.STANDARD, totalSeats: 100 },
    { id: "hall-02", theaterId: "theater-01", name: "2관", hallType: HallType.STANDARD, totalSeats: 100 },
    { id: "hall-03", theaterId: "theater-01", name: "IMAX관", hallType: HallType.IMAX, totalSeats: 100 },
    { id: "hall-04", theaterId: "theater-02", name: "1관", hallType: HallType.STANDARD, totalSeats: 100 },
    { id: "hall-05", theaterId: "theater-02", name: "2관", hallType: HallType.STANDARD, totalSeats: 100 },
    { id: "hall-06", theaterId: "theater-03", name: "1관", hallType: HallType.STANDARD, totalSeats: 100 },
    { id: "hall-07", theaterId: "theater-04", name: "1관", hallType: HallType.STANDARD, totalSeats: 100 },
  ];

  for (const hall of halls) {
    await prisma.hall.upsert({
      where: { id: hall.id },
      update: {},
      create: hall,
    });
  }

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  for (const hall of halls) {
    for (const row of rows) {
      for (let num = 1; num <= 10; num++) {
        await prisma.seat.upsert({
          where: { hallId_row_number: { hallId: hall.id, row, number: num } },
          update: {},
          create: { hallId: hall.id, row, number: num, seatType: SeatType.STANDARD },
        });
      }
    }
  }

  // ================================
  // 영화
  // ================================
  const movies = [
    {
      id: "movie-01",
      title: "인터스텔라",
      titleEn: "Interstellar",
      synopsis: "우주를 넘어 인류의 생존을 건 여정. 지구가 황폐해지면서 인류의 생존 자체가 위협받는 시대, 전직 나사 파일럿 쿠퍼는 어린 딸 머피와의 약속을 뒤로 한 채 새로운 행성을 찾아 우주로 떠나는 탐사대에 합류한다.",
      director: "크리스토퍼 놀란",
      cast: '["매튜 맥커너히", "앤 해서웨이", "제시카 차스테인"]',
      genre: "SF,드라마,어드벤처",
      rating: MovieRating.TWELVE,
      runtime: 169,
      releaseDate: new Date("2014-11-06"),
      posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIe.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/pbrkL804c8yAv3zBZR4QPEafpAR.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
      isNowShowing: true,
      avgScore: 4.8,
      bookingRate: 35.2,
    },
    {
      id: "movie-02",
      title: "어벤져스: 엔드게임",
      titleEn: "Avengers: Endgame",
      synopsis: "타노스에 의해 인류의 절반이 사라진 지 23일. 남겨진 어벤져스가 더 큰 희생을 막기 위해 마지막 전투를 벌인다.",
      director: "안소니 루소, 조 루소",
      cast: '["로버트 다우니 주니어", "크리스 에반스", "마크 러팔로"]',
      genre: "액션,SF,어드벤처",
      rating: MovieRating.TWELVE,
      runtime: 181,
      releaseDate: new Date("2019-04-24"),
      posterUrl: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
      isNowShowing: true,
      avgScore: 4.6,
      bookingRate: 28.7,
    },
    {
      id: "movie-03",
      title: "오펜하이머",
      titleEn: "Oppenheimer",
      synopsis: "제2차 세계대전 중 핵폭탄 개발 프로젝트인 맨해튼 프로젝트를 이끈 물리학자 줄리어스 로버트 오펜하이머의 이야기.",
      director: "크리스토퍼 놀란",
      cast: '["킬리언 머피", "에밀리 블런트", "맷 데이먼"]',
      genre: "드라마,역사,전기",
      rating: MovieRating.FIFTEEN,
      runtime: 180,
      releaseDate: new Date("2023-08-15"),
      posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
      isNowShowing: true,
      avgScore: 4.7,
      bookingRate: 22.1,
    },
    {
      id: "movie-04",
      title: "듄: 파트 2",
      titleEn: "Dune: Part Two",
      synopsis: "폴 아트레이데스가 프레멘 전사 채니와 함께 아라키스의 사막 행성에서 미래를 향한 여정을 시작한다.",
      director: "드니 빌뇌브",
      cast: '["티모시 샬라메", "젠데이아", "레베카 퍼거슨"]',
      genre: "SF,어드벤처,드라마",
      rating: MovieRating.TWELVE,
      runtime: 166,
      releaseDate: new Date("2024-02-28"),
      posterUrl: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
      isNowShowing: true,
      avgScore: 4.5,
      bookingRate: 18.9,
    },
    {
      id: "movie-05",
      title: "인사이드 아웃 2",
      titleEn: "Inside Out 2",
      synopsis: "라일리의 10대 시절. 새로운 감정들이 등장하면서 기존 감정들과 충돌이 시작된다.",
      director: "켈시 만",
      cast: '["에이미 포엘러", "마야 호크", "켄싱턴 탈먼"]',
      genre: "애니메이션,코미디,가족",
      rating: MovieRating.ALL,
      runtime: 100,
      releaseDate: new Date("2024-06-12"),
      posterUrl: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/xg27NrXi7VXCGUr7MG75UqLl6Vg.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=LEjhY15eCx0",
      isComingSoon: true,
      avgScore: 4.3,
      bookingRate: 0,
      releaseDate: new Date("2024-08-14"),
    },
    {
      id: "movie-06",
      title: "데드풀과 울버린",
      titleEn: "Deadpool & Wolverine",
      synopsis: "데드풀이 MCU에 합류하며 울버린과 예상치 못한 팀을 이루게 된다.",
      director: "숀 레비",
      cast: '["라이언 레이놀즈", "휴 잭맨", "엠마 코린"]',
      genre: "액션,코미디,SF",
      rating: MovieRating.ADULT,
      runtime: 127,
      releaseDate: new Date("2024-07-24"),
      posterUrl: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=73_1biulkYk",
      isComingSoon: true,
      avgScore: 4.4,
      bookingRate: 0,
    },
  ];

  for (const movie of movies) {
    await prisma.movie.upsert({
      where: { id: movie.id },
      update: {},
      create: movie,
    });
  }

  // ================================
  // 상영 일정 (향후 7일)
  // ================================
  const nowShowingMovies = movies.filter((m) => m.isNowShowing);

  // 상영 스케줄: [hallId, movieId, price]
  const hallMovieMap = [
    { hallId: "hall-01", movieId: "movie-01", price: 15000 },
    { hallId: "hall-02", movieId: "movie-02", price: 15000 },
    { hallId: "hall-03", movieId: "movie-03", price: 18000 },
    { hallId: "hall-04", movieId: "movie-04", price: 15000 },
    { hallId: "hall-05", movieId: "movie-01", price: 15000 },
    { hallId: "hall-06", movieId: "movie-02", price: 15000 },
    { hallId: "hall-07", movieId: "movie-03", price: 15000 },
  ];

  const startTimes = [10, 13, 16, 19, 22]; // 상영 시작 시간

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let screeningIndex = 0;
  for (let day = 0; day < 7; day++) {
    for (const { hallId, movieId, price } of hallMovieMap) {
      const movie = movies.find((m) => m.id === movieId)!;
      const runtime = movie.runtime ?? 120;

      for (const hour of startTimes) {
        const startTime = new Date(today);
        startTime.setDate(today.getDate() + day);
        startTime.setHours(hour, 0, 0, 0);

        const endTime = new Date(startTime.getTime() + runtime * 60 * 1000);

        const screeningId = `screening-${String(screeningIndex++).padStart(4, "0")}`;

        await prisma.screening.upsert({
          where: { id: screeningId },
          update: {},
          create: {
            id: screeningId,
            movieId,
            hallId,
            startTime,
            endTime,
            price,
            status: ScreeningStatus.SCHEDULED,
          },
        });
      }
    }
  }

  console.log("✅ Seeding complete!");
  console.log("📧 테스트 계정: hong@kgv.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
