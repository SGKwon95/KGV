import { PrismaClient, MovieRating, HallType, SeatType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 극장 생성
  const theater = await prisma.theater.upsert({
    where: { id: "theater-01" },
    update: {},
    create: {
      id: "theater-01",
      name: "KGV 강남",
      region: "서울",
      address: "서울특별시 강남구 강남대로 지하 396",
      phone: "1544-1122",
      latitude: 37.4979,
      longitude: 127.0276,
    },
  });

  // 상영관 생성 (1관)
  const hall1 = await prisma.hall.upsert({
    where: { id: "hall-01" },
    update: {},
    create: {
      id: "hall-01",
      theaterId: theater.id,
      name: "1관",
      hallType: HallType.STANDARD,
      totalSeats: 100,
    },
  });

  // 좌석 생성 (A~J, 1~10)
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  for (const row of rows) {
    for (let num = 1; num <= 10; num++) {
      await prisma.seat.upsert({
        where: { hallId_row_number: { hallId: hall1.id, row, number: num } },
        update: {},
        create: {
          hallId: hall1.id,
          row,
          number: num,
          seatType: SeatType.STANDARD,
        },
      });
    }
  }

  // 샘플 영화 생성
  const movies = [
    {
      id: "movie-01",
      title: "인터스텔라",
      titleEn: "Interstellar",
      synopsis: "우주를 넘어 인류의 생존을 건 여정...",
      director: "크리스토퍼 놀란",
      genre: "SF,드라마,어드벤처",
      rating: MovieRating.TWELVE,
      runtime: 169,
      releaseDate: new Date("2014-11-06"),
      isNowShowing: true,
      avgScore: 4.8,
    },
    {
      id: "movie-02",
      title: "어벤져스: 엔드게임",
      titleEn: "Avengers: Endgame",
      synopsis: "타노스에 맞서는 마지막 전투...",
      director: "안소니 루소, 조 루소",
      genre: "액션,SF,어드벤처",
      rating: MovieRating.TWELVE,
      runtime: 181,
      releaseDate: new Date("2019-04-24"),
      isNowShowing: true,
      avgScore: 4.6,
    },
    {
      id: "movie-03",
      title: "듄: 파트 2",
      titleEn: "Dune: Part Two",
      synopsis: "폴 아트레이데스의 운명...",
      director: "드니 빌뇌브",
      genre: "SF,어드벤처,드라마",
      rating: MovieRating.TWELVE,
      runtime: 166,
      releaseDate: new Date("2024-02-28"),
      isNowShowing: false,
      isComingSoon: true,
      avgScore: 4.5,
    },
  ];

  for (const movie of movies) {
    await prisma.movie.upsert({
      where: { id: movie.id },
      update: {},
      create: movie,
    });
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
