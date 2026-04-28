import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Mock 유저 (DB 없이 테스트용)
const MOCK_USERS = [
  { id: "user-01", name: "홍길동", email: "hong@kgv.com", password: "password123" },
  { id: "user-02", name: "테스트유저", email: "test@kgv.com", password: "password123" },
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = MOCK_USERS.find(
          (u) =>
            u.email === credentials.email &&
            u.password === credentials.password
        );

        if (!user) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) session.user.id = token.id as string;
      return session;
    },
  },
});
