// ================================
// KGV - 공통 타입 정의
// ================================

export type {
  User,
  Movie,
  Theater,
  Hall,
  Seat,
  Screening,
  Booking,
  BookingSeat,
  Review,
  CommonCode,
  PricePolicy,
} from "@prisma/client";

// ================================
// 공통코드 그룹 상수
// ================================
export const CODE_GROUP = {
  USER_ROLE:         "USER_ROLE",
  USER_STATUS:       "USER_STATUS",
  MOVIE_RATING:      "MOVIE_RATING",
  HALL_TYPE:         "HALL_TYPE",
  SEAT_TYPE:         "SEAT_TYPE",
  SCREENING_STATUS:  "SCREENING_STATUS",
  BOOKING_STATUS:    "BOOKING_STATUS",
  TICKET_TYPE:       "TICKET_TYPE",
} as const;

// ================================
// API 응답 타입
// ================================
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ================================
// 영화 관련
// ================================
export interface MovieWithReviews {
  id: string;
  title: string;
  titleEn?: string | null;
  synopsis?: string | null;
  director?: string | null;
  genre?: string | null;
  rating: string;
  runtime?: number | null;
  releaseDate?: Date | null;
  posterUrl?: string | null;
  backdropUrl?: string | null;
  trailerUrl?: string | null;
  isNowShowing: boolean;
  isComingSoon: boolean;
  avgScore: number;
  bookingRate: number;
  _count: {
    reviews: number;
  };
}

// ================================
// 상영 일정 관련
// ================================
export interface ScreeningWithDetails {
  id: string;
  startTime: Date;
  endTime: Date;
  status: string;
  movie: {
    id: string;
    title: string;
    rating: string;
    runtime?: number | null;
  };
  hall: {
    id: string;
    name: string;
    hallType: string;
    totalSeats: number;
    theater: {
      id: string;
      name: string;
      region: string;
    };
  };
  _count: {
    bookings: number;
  };
}

// ================================
// 예매 관련
// ================================
export interface BookingWithDetails {
  id: string;
  bookingNumber: string;
  totalPrice: number;
  status: string;
  bookedAt: Date;
  screening: ScreeningWithDetails;
  bookingSeats: {
    id: string;
    ticketType: string;
    price: number;
    seat: {
      row: string;
      number: number;
      seatType: string;
    };
  }[];
}

// ================================
// 좌석 선택 UI
// ================================
export interface SeatSelection {
  seatId: string;
  row: string;
  number: number;
  seatType: string;
  ticketType: TicketTypeOption;
  price: number;
}

export type TicketTypeOption = "ADULT" | "TEEN" | "CHILD" | "SENIOR" | "DISABLED";

export const TICKET_PRICES: Record<TicketTypeOption, number> = {
  ADULT: 15000,
  TEEN: 12000,
  CHILD: 8000,
  SENIOR: 9000,
  DISABLED: 7000,
};

export const TICKET_TYPE_LABELS: Record<TicketTypeOption, string> = {
  ADULT: "성인",
  TEEN: "청소년",
  CHILD: "어린이",
  SENIOR: "경로",
  DISABLED: "장애인/국가유공자",
};

// ================================
// 가격 정책
// ================================
export const POLICY_GROUP = {
  TICKET: "TICKET",
  HALL:   "HALL",
  TIME:   "TIME",
  DAY:    "DAY",
} as const;

export type PolicyGroup = typeof POLICY_GROUP[keyof typeof POLICY_GROUP];

export interface PriceBreakdown {
  basePrice:     number;
  hallSurcharge: number;
  timeSurcharge: number;
  daySurcharge:  number;
  seatSurcharge: number;
  totalPerSeat:  number;
}

export interface BookingSeatRequest {
  seatId:     string;
  ticketType: TicketTypeOption;
}
