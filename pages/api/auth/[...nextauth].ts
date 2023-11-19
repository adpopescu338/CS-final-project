import Credentials from 'next-auth/providers/credentials';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { client } from 'prisma/client';
import { BeError } from 'lib/BeError';
import { ErrorCodes } from 'lib/constants';
import bcrypt from 'bcryptjs';
import { NextAuthUser } from 'lib/next-auth';

const getUser = async (email: string, password: string): Promise<NextAuthUser> => {
  const user = await client.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) throw new BeError('User not found', ErrorCodes.NotFound);

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new BeError('Invalid credentials', ErrorCodes.Unauthorized);

  if (!user.emailVerified) throw new BeError('Email not verified', ErrorCodes.Unauthorized);

  return user;
};

export const authOptions: NextAuthOptions = {
  debug: true,
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Email',
          type: 'text',
          placeholder: 'jsmith@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        // Add logic here to look up the user from the credentials supplied
        return getUser(credentials.username, credentials.password);
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async signIn({ user }) {
      return !!user;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = `${token.firstName} ${token.lastName}`;
      session.user.name = token.name as string;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_TERCES,
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  session: {
    strategy: 'jwt',
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

export default NextAuth(authOptions);
