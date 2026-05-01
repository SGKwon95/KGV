import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ================================
  // 공통코드 (CommonCode)
  // ================================
  const commonCodes = [
    // USER_ROLE
    { groupCode: "USER_ROLE", code: "USER",       label: "일반사용자",          sortOrder: 1 },
    { groupCode: "USER_ROLE", code: "ADMIN",      label: "관리자",              sortOrder: 2 },

    // USER_STATUS
    { groupCode: "USER_STATUS", code: "ACTIVE",    label: "활성",   sortOrder: 1 },
    { groupCode: "USER_STATUS", code: "INACTIVE",  label: "비활성", sortOrder: 2 },
    { groupCode: "USER_STATUS", code: "SUSPENDED", label: "정지",   sortOrder: 3 },

    // MOVIE_RATING
    { groupCode: "MOVIE_RATING", code: "ALL",     label: "전체관람가",        sortOrder: 1 },
    { groupCode: "MOVIE_RATING", code: "TWELVE",  label: "12세이상관람가",    sortOrder: 2 },
    { groupCode: "MOVIE_RATING", code: "FIFTEEN", label: "15세이상관람가",    sortOrder: 3 },
    { groupCode: "MOVIE_RATING", code: "ADULT",   label: "청소년관람불가",    sortOrder: 4 },

    // HALL_TYPE (extraValue = 할증료)
    { groupCode: "HALL_TYPE", code: "STANDARD", label: "일반관",     extraValue: "0",    sortOrder: 1 },
    { groupCode: "HALL_TYPE", code: "IMAX",     label: "IMAX관",     extraValue: "5000", sortOrder: 2 },
    { groupCode: "HALL_TYPE", code: "FOUR_DX",  label: "4DX관",      extraValue: "6000", sortOrder: 3 },
    { groupCode: "HALL_TYPE", code: "SCREEN_X", label: "ScreenX관",  extraValue: "4000", sortOrder: 4 },
    { groupCode: "HALL_TYPE", code: "PREMIUM",  label: "프리미엄관", extraValue: "3000", sortOrder: 5 },

    // SEAT_TYPE
    { groupCode: "SEAT_TYPE", code: "STANDARD",   label: "일반석",   sortOrder: 1 },
    { groupCode: "SEAT_TYPE", code: "PREMIUM",    label: "프리미엄석", sortOrder: 2 },
    { groupCode: "SEAT_TYPE", code: "COUPLE",     label: "커플석",   sortOrder: 3 },
    { groupCode: "SEAT_TYPE", code: "WHEELCHAIR", label: "장애인석", sortOrder: 4 },

    // SCREENING_STATUS
    { groupCode: "SCREENING_STATUS", code: "SCHEDULED", label: "상영예정", sortOrder: 1 },
    { groupCode: "SCREENING_STATUS", code: "ONGOING",   label: "상영중",   sortOrder: 2 },
    { groupCode: "SCREENING_STATUS", code: "ENDED",     label: "상영종료", sortOrder: 3 },
    { groupCode: "SCREENING_STATUS", code: "CANCELLED", label: "취소",     sortOrder: 4 },

    // BOOKING_STATUS
    { groupCode: "BOOKING_STATUS", code: "PENDING",   label: "결제대기",  sortOrder: 1 },
    { groupCode: "BOOKING_STATUS", code: "CONFIRMED", label: "예매완료",  sortOrder: 2 },
    { groupCode: "BOOKING_STATUS", code: "CANCELLED", label: "취소됨",    sortOrder: 3 },
    { groupCode: "BOOKING_STATUS", code: "REFUNDED",  label: "환불완료",  sortOrder: 4 },

    // TICKET_TYPE (extraValue = 기본 가격)
    { groupCode: "TICKET_TYPE", code: "ADULT",    label: "성인",              extraValue: "15000", sortOrder: 1 },
    { groupCode: "TICKET_TYPE", code: "TEEN",     label: "청소년",            extraValue: "12000", sortOrder: 2 },
    { groupCode: "TICKET_TYPE", code: "CHILD",    label: "어린이",            extraValue: "8000",  sortOrder: 3 },
    { groupCode: "TICKET_TYPE", code: "SENIOR",   label: "경로",              extraValue: "9000",  sortOrder: 4 },
    { groupCode: "TICKET_TYPE", code: "DISABLED", label: "장애인/국가유공자", extraValue: "7000",  sortOrder: 5 },
  ];

  for (const item of commonCodes) {
    await prisma.commonCode.upsert({
      where: { groupCode_code: { groupCode: item.groupCode, code: item.code } },
      update: { label: item.label, extraValue: item.extraValue ?? null, sortOrder: item.sortOrder },
      create: { ...item },
    });
  }

  console.log(`✅ CommonCode ${commonCodes.length}개 시딩 완료`);

  // ================================
  // 가격 정책 (PricePolicy)
  // ================================
  const pricePolicies = [
    // TICKET
    { id: "pp-ticket-adult",    policyGroup: "TICKET", code: "ADULT",    label: "성인",              value: 15000, sortOrder: 1 },
    { id: "pp-ticket-teen",     policyGroup: "TICKET", code: "TEEN",     label: "청소년",            value: 12000, sortOrder: 2 },
    { id: "pp-ticket-child",    policyGroup: "TICKET", code: "CHILD",    label: "어린이",            value: 8000,  sortOrder: 3 },
    { id: "pp-ticket-senior",   policyGroup: "TICKET", code: "SENIOR",   label: "경로",              value: 9000,  sortOrder: 4 },
    { id: "pp-ticket-disabled", policyGroup: "TICKET", code: "DISABLED", label: "장애인/국가유공자", value: 7000,  sortOrder: 5 },
    // HALL
    { id: "pp-hall-standard", policyGroup: "HALL", code: "STANDARD", label: "일반관",     value: 0,    sortOrder: 1 },
    { id: "pp-hall-imax",     policyGroup: "HALL", code: "IMAX",     label: "IMAX",       value: 5000, sortOrder: 2 },
    { id: "pp-hall-fourdx",   policyGroup: "HALL", code: "FOUR_DX",  label: "4DX",        value: 6000, sortOrder: 3 },
    { id: "pp-hall-screenx",  policyGroup: "HALL", code: "SCREEN_X", label: "ScreenX",    value: 4000, sortOrder: 4 },
    { id: "pp-hall-premium",  policyGroup: "HALL", code: "PREMIUM",  label: "프리미엄",   value: 3000, sortOrder: 5 },
    // TIME
    { id: "pp-time-morning", policyGroup: "TIME", code: "morning", label: "조조", description: "오전 11시 이전 시작", value: -2000, sortOrder: 1 },
    { id: "pp-time-regular", policyGroup: "TIME", code: "regular", label: "일반", description: "11:00 ~ 17:59 시작",  value: 0,     sortOrder: 2 },
    { id: "pp-time-evening", policyGroup: "TIME", code: "evening", label: "저녁", description: "18:00 ~ 21:59 시작", value: 1000,  sortOrder: 3 },
    { id: "pp-time-night",   policyGroup: "TIME", code: "night",   label: "심야", description: "22:00 이후 시작",    value: 2000,  sortOrder: 4 },
    // DAY
    { id: "pp-day-weekday", policyGroup: "DAY", code: "weekday", label: "평일",   description: "월~목", value: 0,    sortOrder: 1 },
    { id: "pp-day-friday",  policyGroup: "DAY", code: "friday",  label: "금요일",               value: 1000, sortOrder: 2 },
    { id: "pp-day-weekend", policyGroup: "DAY", code: "weekend", label: "주말",   description: "토~일", value: 2000, sortOrder: 3 },
    { id: "pp-day-holiday", policyGroup: "DAY", code: "holiday", label: "공휴일",               value: 2000, sortOrder: 4 },
    // SEAT_TYPE
    { id: "pp-seat-couple", policyGroup: "SEAT_TYPE", code: "COUPLE", label: "커플석", description: "커플석 추가 요금", value: 3000, sortOrder: 1 },
  ];

  for (const item of pricePolicies) {
    await prisma.pricePolicy.upsert({
      where: { id: item.id },
      update: { value: item.value, label: item.label, isActive: true },
      create: { ...item, startAt: null, endAt: null },
    });
  }

  console.log(`✅ PricePolicy ${pricePolicies.length}개 시딩 완료`);

  // ================================
  // 테스트 유저
  // ================================
  const hashedPassword = await bcrypt.hash("password123", 12);

  await prisma.user.upsert({
    where: { email: "hong@kgv.com" },
    update: {},
    create: {
      id: "user-01",
      loginId: "hong",
      name: "홍길동",
      email: "hong@kgv.com",
      password: hashedPassword,
      nickname: "영화광",
      phone: "010-1234-5678",
      role: "USER",
      userStatus: "ACTIVE",
    },
  });

  await prisma.user.upsert({
    where: { email: "test@kgv.com" },
    update: {},
    create: {
      id: "user-02",
      loginId: "testuser",
      name: "테스트유저",
      email: "test@kgv.com",
      password: hashedPassword,
      role: "USER",
      userStatus: "ACTIVE",
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
    { id: "hall-01", theaterId: "theater-01", name: "1관",    hallType: "STANDARD", totalSeats: 100 },
    { id: "hall-02", theaterId: "theater-01", name: "2관",    hallType: "STANDARD", totalSeats: 100 },
    { id: "hall-03", theaterId: "theater-01", name: "IMAX관", hallType: "IMAX",     totalSeats: 100 },
    { id: "hall-04", theaterId: "theater-02", name: "1관",    hallType: "STANDARD", totalSeats: 100 },
    { id: "hall-05", theaterId: "theater-02", name: "2관",    hallType: "STANDARD", totalSeats: 100 },
    { id: "hall-06", theaterId: "theater-03", name: "1관",    hallType: "STANDARD", totalSeats: 100 },
    { id: "hall-07", theaterId: "theater-04", name: "1관",    hallType: "STANDARD", totalSeats: 100 },
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
          create: { hallId: hall.id, row, number: num, seatType: "STANDARD" },
        });
      }
    }
  }

  // ================================
  // 영화 (2026년 4~5월 현재 상영작)
  // ================================
  const movies = [
    {
      id: "movie-07",
      title: "프로젝트 헤일메리",
      titleEn: "Project Hail Mary",
      synopsis: "중학교 과학교사 그레이스가 우주 한가운데서 깨어나 죽어가는 태양으로부터 지구를 구하는 미션을 맡게 된다. 기억을 잃은 그레이스는 우주에서 같은 목적으로 온 로키를 만나 두 행성의 운명을 건 마지막 미션을 수행하게 된다.",
      director: "필 로드, 크리스토퍼 밀러",
      cast: '["라이언 고슬링", "산드라 휠러"]',
      genre: "SF,드라마,스릴러",
      rating: "TWELVE",
      runtime: 156,
      releaseDate: new Date("2026-03-18"),
      posterUrl: "https://image.cine21.com/resize/cine21/poster/2026/0227/12_33_51__69a1109f40cba[X280,400].jpg",
      isNowShowing: true,
      avgScore: 4.6,
      bookingRate: 32.1,
    },
    {
      id: "movie-08",
      title: "슈퍼 마리오 갤럭시",
      titleEn: "The Super Mario Bros. Movie: Galaxy",
      synopsis: "마리오와 루이지가 모래 왕국에서 임무 수행 중 요시를 구출하면서 우정을 쌓게 된다. 쿠파주니어가 로젤리나를 납치하고 버섯 왕국을 습격하자, 이 팀이 갤럭시로 나가 위기를 해결한다.",
      director: "아론 호바스, 마이클 젤레닉",
      cast: '["크리스 프랫", "안야 테일러 조이", "잭 블랙"]',
      genre: "애니메이션,어드벤처,코미디",
      rating: "ALL",
      runtime: 98,
      releaseDate: new Date("2026-04-29"),
      posterUrl: "https://image.cine21.com/resize/cine21/poster/2026/0327/62796_69c648d222c08[X280,400].jpg",
      isNowShowing: true,
      avgScore: 4.3,
      bookingRate: 28.5,
    },
    {
      id: "movie-09",
      title: "살목지",
      synopsis: "기이한 소문이 끊이지 않는 저수지 살목지의 로드뷰 화면에 촬영한 적 없는 정체불명의 형체가 포착된다. PD 수인과 촬영팀이 재촬영을 위해 살목지로 향하며, 설명되지 않는 일들이 연달아 벌어져 팀은 점점 깊은 공포에 빠진다.",
      director: "이상민",
      cast: '["김혜윤", "이종원", "김준한"]',
      genre: "공포,미스터리",
      rating: "FIFTEEN",
      runtime: 95,
      releaseDate: new Date("2026-04-08"),
      posterUrl: "https://image.cine21.com/resize/cine21/poster/2026/0317/09_48_34__69b8a4e27933e[X280,400].jpg",
      isNowShowing: true,
      avgScore: 3.9,
      bookingRate: 14.7,
    },
    {
      id: "movie-10",
      title: "악마는 프라다를 입는다 2",
      titleEn: "The Devil Wears Prada 2",
      synopsis: "전 세계 트렌드를 주도해 온 전설적인 패션 매거진 런웨이가 급변하는 미디어 시장 속에서 예기치 못한 위기에 직면한다. 편집장 미란다, 20년 만에 복귀한 기획 에디터 앤디, 럭셔리 브랜드 임원이 된 에밀리가 뉴욕 패션계에서 주도권을 놓고 벌이는 새로운 이야기.",
      director: "데이비드 프랭클",
      cast: '["메릴 스트립", "앤 해서웨이", "에밀리 블런트"]',
      genre: "코미디,드라마",
      rating: "TWELVE",
      runtime: 118,
      releaseDate: new Date("2026-04-29"),
      posterUrl: "https://image.cine21.com/resize/cine21/poster/2026/0429/17_10_31__69f1bcf7d8992[X280,400].jpg",
      isNowShowing: true,
      avgScore: 4.1,
      bookingRate: 19.3,
    },
    {
      id: "movie-11",
      title: "극장판 짱구는 못말려: 초화려! 작열하는 떡잎마을 댄서즈",
      titleEn: "Crayon Shin-chan the Movie: Super Hot! The Spicy Kasukabe Dancers",
      synopsis: "떡잎마을 방범대가 어린이 엔터테인먼트 축제에서 우승하여 인도 페스티벌 무대에 초청받는다. 신비한 종이가 코에 꽂히면 욕망을 불러일으켜 폭군으로 변신시키는 신비한 물건을 둘러싼 모험이 시작된다.",
      director: "하시모토 마사카즈",
      cast: '["짱구", "맹구", "철수", "유리", "훈이"]',
      genre: "애니메이션,코미디,가족",
      rating: "ALL",
      runtime: 105,
      releaseDate: new Date("2025-12-24"),
      posterUrl: "https://image.cine21.com/resize/cine21/poster/2025/1224/14_14_56__694b76d0bdec4[X280,400].jpg",
      isNowShowing: true,
      avgScore: 4.0,
      bookingRate: 5.4,
    },
    // ================================
    // 개봉예정작
    // ================================
    {
      id: "movie-12",
      title: "만달로리안과 그로구",
      titleEn: "The Mandalorian and Grogu",
      synopsis: "은하 제국의 몰락 이후, 잔존 제국 군벌들이 은하계를 위협하는 가운데 신공화국은 딘 자린과 그의 제자 그로구에게 헛족 로타 구출 임무를 의뢰한다. 스타워즈 드라마 시리즈의 후속작으로, 거대한 스케일의 우주 모험이 펼쳐진다.",
      director: "존 파브로",
      cast: '["페드로 파스칼", "제레미 앨런 화이트", "시고니 위버"]',
      genre: "SF,액션,어드벤처",
      rating: "TWELVE",
      runtime: 132,
      releaseDate: new Date("2026-05-22"),
      posterUrl: null,
      isNowShowing: false,
      isComingSoon: true,
      avgScore: 0,
      bookingRate: 0,
    },
    {
      id: "movie-13",
      title: "토이 스토리 5",
      titleEn: "Toy Story 5",
      synopsis: "우디가 떠난 후 제시가 보니의 방 장난감들의 새 리더가 된다. 이제 8살이 된 보니는 태블릿에만 빠져 장난감에 관심이 없다. 기술의 발전 속에서 장난감의 존재 의미를 찾아가는 따뜻한 여정이 시작된다.",
      director: "앤드류 스탠튼",
      cast: '["톰 행크스", "팀 앨런", "조안 쿠삭", "키아누 리브스"]',
      genre: "애니메이션,어드벤처,코미디,가족",
      rating: "ALL",
      runtime: 100,
      releaseDate: new Date("2026-06-19"),
      posterUrl: null,
      isNowShowing: false,
      isComingSoon: true,
      avgScore: 0,
      bookingRate: 0,
    },
    {
      id: "movie-14",
      title: "슈퍼걸: 내일의 여인",
      titleEn: "Supergirl: Woman of Tomorrow",
      synopsis: "23번째 생일을 맞이한 카라 조-엘은 반려견 크립토와 함께 우주를 여행하던 중, 복수를 꿈꾸는 소녀 루시를 만나 예상치 못한 임무에 뛰어들게 된다. 슈퍼맨과는 다른, 냉소적이고 강인한 슈퍼걸의 첫 번째 단독 영화.",
      director: "크레이그 길레스피",
      cast: '["밀리 알콕", "제이슨 모모아", "이브 리들리", "데이비드 코렌스웻"]',
      genre: "SF,액션,슈퍼히어로",
      rating: "TWELVE",
      runtime: 120,
      releaseDate: new Date("2026-06-26"),
      posterUrl: null,
      isNowShowing: false,
      isComingSoon: true,
      avgScore: 0,
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
  const hallMovieMap = [
    { hallId: "hall-01", movieId: "movie-07" },
    { hallId: "hall-02", movieId: "movie-10" },
    { hallId: "hall-03", movieId: "movie-08" },
    { hallId: "hall-04", movieId: "movie-09" },
    { hallId: "hall-05", movieId: "movie-11" },
    { hallId: "hall-06", movieId: "movie-07" },
    { hallId: "hall-07", movieId: "movie-10" },
  ];

  const startTimes = [10, 13, 16, 19];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let screeningIndex = 0;
  for (let day = 0; day < 7; day++) {
    for (const { hallId, movieId } of hallMovieMap) {
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
            status: "SCHEDULED",
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
