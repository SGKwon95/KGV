import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-kgv-dark border-t border-kgv-gray mt-auto">
      <div className="container-main py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-4">영화</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/movies?type=nowShowing"
                  className="hover:text-white transition-colors"
                >
                  현재상영
                </Link>
              </li>
              <li>
                <Link
                  href="/movies?type=comingSoon"
                  className="hover:text-white transition-colors"
                >
                  개봉예정
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">예매</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/booking"
                  className="hover:text-white transition-colors"
                >
                  영화 예매
                </Link>
              </li>
              <li>
                <Link
                  href="/mypage"
                  className="hover:text-white transition-colors"
                >
                  예매 내역
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">극장</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/theaters"
                  className="hover:text-white transition-colors"
                >
                  극장 찾기
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">고객센터</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="text-white font-bold text-lg">1544-1122</li>
              <li>평일 09:00 ~ 18:00</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-kgv-gray pt-8 text-center text-sm text-gray-500">
          <p>© 2026 KGV. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
