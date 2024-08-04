import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { connectMongo } from "@/lib/connectMongo";
import User from "@/model/Schema";
import { compare } from "bcryptjs";

type User = {
  email: string;
  password: string;
};

function generatePass(len: number): string {
  let pass = "";
  const str =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

  for (let i = 1; i <= len; i++) {
    const char = Math.floor(Math.random() * str.length + 1);

    pass += str.charAt(char);
  }
  return pass;

 
}

export const authOptions: NextAuthOptions  = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // @ts-ignore
      async authorize(credentials: {
        email: string;
        password: string;
      }): Promise<User | null> {
        if (!credentials.email || !credentials.password) {
          return null;
        }

        await connectMongo();
        const email = credentials.email;
        const password = credentials.password;

        const user = { email, password };
        const foundUser = await User.findOne({ email });
        if (!foundUser) {
          return null; // Unauthorized
        }

        // Evaluate password
        const match = await compare(credentials.password, foundUser.password);
        if (match) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token }: any) {
      const user = await User.findOne({ email: token.email });
      token.user = user;
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.user._id.toString();
      }
      return session;
    },
    async signIn({ user }: any) {
      try {
        await connectMongo();
        const userExists = await User.findOne({
          email: user.email,
        });
        if (!userExists) {
          await User.create({
            email: user.email,
            password: generatePass(20),
          });
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
// @ts-ignore
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
