import { prisma } from "@/lib/db";
import { TICKET_PRICES, type TicketTypeOption, type PriceBreakdown, type BookingSeatRequest } from "@/types";

// ================================
// 현재 유효한 정책 조회
// ================================
// 기간 지정 정책(startAt 있음)이 영구 정책(startAt null)보다 항상 우선됨.
// 여러 정책이 겹칠 경우 startAt DESC로 가장 최근에 시작한 것을 선택.
async function getActivePolicy(policyGroup: string, code: string) {
  const now = new Date();
  return prisma.pricePolicy.findFirst({
    where: {
      policyGroup,
      code,
      isActive: true,
      AND: [
        {
          OR: [
            { startAt: null },
            { startAt: { lte: now } },
          ],
        },
        {
          OR: [
            { endAt: null },
            { endAt: { gte: now } },
          ],
        },
      ],
    },
    orderBy: { startAt: "desc" },
  });
}

// ================================
// 시간대 코드 판별
// ================================
function getTimeCode(startTime: Date): string {
  const hour = startTime.getHours();
  if (hour < 11)  return "morning"; // 11시 이전
  if (hour < 18)  return "regular"; // 11:00 ~ 17:59
  if (hour < 22)  return "evening"; // 18:00 ~ 21:59
  return "night";                   // 22:00 이후
}

// ================================
// 요일 코드 판별 (0=일, 1=월, ..., 6=토)
// ================================
function getDayCode(startTime: Date): string {
  const day = startTime.getDay();
  if (day === 5) return "friday";
  if (day === 0 || day === 6) return "weekend";
  return "weekday";
}

// ================================
// 좌석 1석 가격 계산
// ================================
export async function calculateTicketPrice(
  ticketType: TicketTypeOption,
  hallType: string,
  screeningStartTime: Date,
  seatType?: string
): Promise<PriceBreakdown> {
  const timeCode = getTimeCode(screeningStartTime);
  const dayCode  = getDayCode(screeningStartTime);

  const [ticketPolicy, hallPolicy, timePolicy, dayPolicy, seatPolicy] = await Promise.all([
    getActivePolicy("TICKET",    ticketType),
    getActivePolicy("HALL",      hallType),
    getActivePolicy("TIME",      timeCode),
    getActivePolicy("DAY",       dayCode),
    seatType ? getActivePolicy("SEAT_TYPE", seatType) : Promise.resolve(null),
  ]);

  const basePrice     = ticketPolicy?.value ?? TICKET_PRICES[ticketType] ?? 15000;
  const hallSurcharge = hallPolicy?.value   ?? 0;
  const timeSurcharge = timePolicy?.value   ?? 0;
  const daySurcharge  = dayPolicy?.value    ?? 0;
  const seatSurcharge = seatPolicy?.value   ?? 0;
  const totalPerSeat  = basePrice + hallSurcharge + timeSurcharge + daySurcharge + seatSurcharge;

  return { basePrice, hallSurcharge, timeSurcharge, daySurcharge, seatSurcharge, totalPerSeat };
}

// ================================
// 전체 예매 좌석 가격 일괄 계산
// ================================
export async function calculateBookingPrice(
  seats: Array<BookingSeatRequest & { seatType?: string }>,
  hallType: string,
  screeningStartTime: Date
): Promise<{
  seats: Array<BookingSeatRequest & { price: number }>;
  totalPrice: number;
}> {
  const pricedSeats = await Promise.all(
    seats.map(async (seat) => {
      const breakdown = await calculateTicketPrice(
        seat.ticketType,
        hallType,
        screeningStartTime,
        seat.seatType
      );
      return { ...seat, price: breakdown.totalPerSeat };
    })
  );

  const totalPrice = pricedSeats.reduce((sum, s) => sum + s.price, 0);
  return { seats: pricedSeats, totalPrice };
}
