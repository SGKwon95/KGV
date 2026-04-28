"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Star } from "lucide-react";

interface Review {
  id: string;
  score: number;
  content?: string | null;
  createdAt: Date;
  user: {
    name?: string | null;
    image?: string | null;
  };
}

interface ReviewSectionProps {
  movieId: string;
  reviews: Review[];
}

export function ReviewSection({ movieId, reviews }: ReviewSectionProps) {
  const [showSpoiler, setShowSpoiler] = useState<Record<string, boolean>>({});

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-white mb-6">
        관람객 리뷰 ({reviews.length})
      </h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-kgv-gray rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {review.user.image ? (
                  <Image
                    src={review.user.image}
                    alt={review.user.name ?? ""}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-kgv-dark flex items-center justify-center text-gray-400 text-sm">
                    {review.user.name?.[0] ?? "?"}
                  </div>
                )}
                <span className="text-sm text-gray-300">{review.user.name ?? "익명"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-kgv-gold fill-kgv-gold" />
                <span className="text-sm text-kgv-gold">{review.score.toFixed(1)}</span>
              </div>
            </div>
            {review.content && (
              <p className="text-sm text-gray-300 leading-relaxed">{review.content}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              {formatDate(review.createdAt)}
            </p>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-center text-gray-500 py-8">아직 리뷰가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
