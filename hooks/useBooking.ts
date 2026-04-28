"use client";

import { create } from "zustand";
import type { SeatSelection, TicketTypeOption, TICKET_PRICES } from "@/types";

interface BookingState {
  screeningId: string | null;
  selectedSeats: SeatSelection[];

  setScreeningId: (id: string) => void;
  addSeat: (seat: SeatSelection) => void;
  removeSeat: (seatId: string) => void;
  updateTicketType: (seatId: string, ticketType: TicketTypeOption) => void;
  clearBooking: () => void;
  getTotalPrice: () => number;
  getSeatCount: () => number;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  screeningId: null,
  selectedSeats: [],

  setScreeningId: (id) => set({ screeningId: id }),

  addSeat: (seat) =>
    set((state) => ({
      selectedSeats: [...state.selectedSeats, seat],
    })),

  removeSeat: (seatId) =>
    set((state) => ({
      selectedSeats: state.selectedSeats.filter((s) => s.seatId !== seatId),
    })),

  updateTicketType: (seatId, ticketType) =>
    set((state) => ({
      selectedSeats: state.selectedSeats.map((s) =>
        s.seatId === seatId ? { ...s, ticketType } : s
      ),
    })),

  clearBooking: () => set({ screeningId: null, selectedSeats: [] }),

  getTotalPrice: () =>
    get().selectedSeats.reduce((sum, seat) => sum + seat.price, 0),

  getSeatCount: () => get().selectedSeats.length,
}));
