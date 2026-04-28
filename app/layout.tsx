import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/layout/Providers";

export const metadata: Metadata = {
  title: {
    default: "KGV 영화관",
    template: "%s | KGV",
  },
  description: "KGV에서 최신 영화를 예매하세요. 편리한 온라인 예매 서비스.",
  keywords: ["KGV", "영화관", "영화예매", "상영시간표"],
  openGraph: {
    title: "KGV 영화관",
    description: "KGV에서 최신 영화를 예매하세요.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
