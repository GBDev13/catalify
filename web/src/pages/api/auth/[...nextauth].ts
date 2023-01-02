import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import { api } from "../../../lib/axios";
import jwt_decode from "jwt-decode";

export default NextAuth({
    secret: process.env.SECRET,
    providers: [
        CredentialsProvider({
            name: 'digital-catalog',
            credentials: {
                email: {
                    label: 'email',
                    type: 'email',
                    placeholder: 'jsmith@example.com',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                try {
                  const response = await api.post("/auth/login", credentials)
                  
                  if (response.data.user) {
                    console.log('login', response.data.user)
                      return response.data
                  }

                  console.log('response', response)

                  return null;
                } catch (err) {
                  return null;
                }
            },
        }),
    ],
    session: {
        maxAge: 6 * 24 * 60 * 60, // 6 days
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user , account}) {
            if (user && account) {
                return {
                    ...token,
                    accessToken: user.access_token,
                };
            }
            return token
        },

        async session({ session, token }) {
            const parsed = parseJWT(token.accessToken as string) as any;

            session.user.id = parsed.sub;
            session.user.firstName = parsed.firstName;
            session.user.lastName = parsed.lastName;
            session.user.email = parsed.email;
            
            return session;
        },
    },
});

const parseJWT = (token: string) => {
    if (!token) {
        return {};
    }

    try {
        return jwt_decode(token);
      } catch (e) {
        console.error(e);
        return null;
    }
}