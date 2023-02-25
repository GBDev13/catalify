import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import api from "../../../lib/axios";
import jwt_decode from "jwt-decode";

type TokenType = {
    accessToken: string;
    refreshToken: string;
}

const refreshAccessToken = async (token: TokenType) => {
    try {
        const { status, data } = await api.post("/auth/refresh", {
            refreshToken: token.refreshToken,
        })

        if (status !== 200) {
            throw token
        }

        return {
            ...token,
            accessToken: data.access_token
        }
    } catch (error) {
        return {
            ...token,
            error: "RefreshAccessTokenError",
        }
    }
}

const useSecureCookies = !!process.env.VERCEL_URL

export const authOptions: NextAuthOptions = {
    secret: process.env.SECRET,
    cookies: {
        sessionToken: {
            name: `${useSecureCookies ? '__Secure-' : ''}next-auth.session-token`,
            options: {
                domain: useSecureCookies ? ".catalify.com.br" : ".test.com",
                path: "/",
                httpOnly: true,
                sameSite: "lax",
                secure: useSecureCookies
            }
        }
    },
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
                      return response.data
                  }

                  return null;
                } catch (err) {
                  return Promise.reject(new Error((err as any)?.response?.data?.message ?? "Email e/ou senha inválidos"))
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    events: {
        signOut: async (session) => {
            if(session?.token?.refreshToken) {
                await api.post("/auth/logout", {
                    refreshToken: session.token.refreshToken,
                })
            }
        }
    },
    callbacks: {
        async jwt({ token, user , account}) {
            if (user && account) {
                return {
                    ...token,
                    accessToken: user.access_token,
                    refreshToken: user.refresh_token,
                };
            }

            const parsedToken = parseJWT(token.accessToken as string) as any;
            const expiresAt = new Date(parsedToken.exp * 1000);

            if(Date.now() < expiresAt.getTime()) {
                return token;
            }

            return refreshAccessToken(token as TokenType)
        },

        async session({ session, token }) {
            const parsed = parseJWT(token.accessToken as string) as any;

            session.user.id = parsed.sub;
            session.user.firstName = parsed.firstName;
            session.user.lastName = parsed.lastName;
            session.user.email = parsed.email;
            session.user.access_token = String(token.accessToken);
            session.user.refresh_token = String(token.refreshToken);
            
            return session;
        },
    },
};

export default NextAuth(authOptions);

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