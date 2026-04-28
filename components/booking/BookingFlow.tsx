"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MovieStep } from "@/components/booking/MovieStep";
import { ScheduleStep } from "@/components/booking/ScheduleStep";
import { SeatStep } from "@/components/booking/SeatStep";
import { PaymentStep } from "@/components/booking/PaymentStep";

const STEPS = ["영화선택", "날짜/시간", "좌석선택", "결제"];

interface BookingFlowProps {
  movies: { id: string; title: string; rating: string; runtime?: number | null; posterUrl?: string | null }[];
  theaters: { id: string; name: string; region: string }[];
  initialMovieId?: string;
  initialScreeningId?: string;
}

export function BookingFlow({ movies, theaters, initialMovieId, initialScreeningId }: BookingFlowProps) {
  const [step, setStep] = useState(initialScreeningId ? 2 : initialMovieId ? 1 : 0);
  const [movieId, setMovieId] = useState(initialMovieId ?? "");
  const [screeningId, setScreeningId] = useState(initialScreeningId ?? "");

  const handleMovieSelect = (id: string) => {
    setMovieId(id);
    setStep(1);
  };

  const handleScheduleSelect = (id: string) => {
    setScreeningId(id);
    setStep(2);
  };

  return (
    <div>
      {/* 스텝 인디케이터 */}
      <div className="flex mb-10">
        {STEPS.map((label, i) => (
          <div key={i} className="flex-1 flex items-center">
            <div className="flex flex-col items-center w-full">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                  i < step
                    ? "bg-kgv-red text-white"
                    : i === step
                      ? "bg-kgv-red text-white ring-4 ring-kgv-red/30"
                      : "bg-kgv-gray text-gray-500"
                )}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={cn(
                  "text-xs mt-1",
                  i === step ? "text-white" : "text-gray-500"
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 -mt-4 transition-colors",
                  i < step ? "bg-kgv-red" : "bg-kgv-gray"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* 스텝 콘텐츠 */}
      <div>
        {step === 0 && (
          <MovieStep movies={movies} selectedMovieId={movieId} onSelect={handleMovieSelect} />
        )}
        {step === 1 && movieId && (
          <ScheduleStep
            movieId={movieId}
            theaters={theaters}
            onSelect={handleScheduleSelect}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && screeningId && (
          <SeatStep
            screeningId={screeningId}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && screeningId && (
          <PaymentStep
            screeningId={screeningId}
            onBack={() => setStep(2)}
          />
        )}
      </div>
    </div>
  );
}
