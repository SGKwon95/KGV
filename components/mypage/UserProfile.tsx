import Image from "next/image";
import { formatDate, formatPrice } from "@/lib/utils";
import { User } from "lucide-react";

interface UserProfileProps {
  user: {
    name?: string | null;
    email: string;
    nickname?: string | null;
    phone?: string | null;
    image?: string | null;
    createdAt: Date;
  };
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="bg-kgv-gray rounded-xl p-6">
      <div className="flex flex-col items-center text-center mb-6">
        {user.image ? (
          <Image src={user.image} alt={user.name ?? ""} width={80} height={80} className="rounded-full mb-3" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-kgv-dark flex items-center justify-center mb-3">
            <User size={32} className="text-gray-500" />
          </div>
        )}
        <h2 className="text-xl font-bold text-white">{user.name ?? "이름 없음"}</h2>
        <p className="text-gray-400 text-sm">{user.email}</p>
      </div>

      <div className="space-y-3">
        {user.nickname && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">닉네임</span>
            <span className="text-white">{user.nickname}</span>
          </div>
        )}
        {user.phone && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">휴대폰</span>
            <span className="text-white">{user.phone}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">가입일</span>
          <span className="text-white">{formatDate(user.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
