"use client";

import { create } from "zustand";
import type { SeatSelection, TicketTypeOption } from "@/types";

interface BookingState {
  screeningId: string | null;
  selectedSeats: SeatSelection[];

  setScreeningId: (id: string) => void;
  addSeat: (seat: SeatSelection) => void;
  removeSeat: (seatId: string) => void;
  updateSeatPrice: (seatId: string, price: number) => void;
  updateTicketType: (seatId: string, ticketType: TicketTypeOption, price: number) => void;
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

  updateSeatPrice: (seatId, price) =>
    set((state) => ({
      selectedSeats: state.selectedSeats.map((s) =>
        s.seatId === seatId ? { ...s, price } : s
      ),
    })),

  updateTicketType: (seatId, ticketType, price) =>
    set((state) => ({
      selectedSeats: state.selectedSeats.map((s) =>
        s.seatId === seatId ? { ...s, ticketType, price } : s
      ),
    })),

  clearBooking: () => set({ screeningId: null, selectedSeats: [] }),

  getTotalPrice: () =>
    get().selectedSeats.reduce((sum, seat) => sum + seat.price, 0),

  getSeatCount: () => get().selectedSeats.length,
}));
