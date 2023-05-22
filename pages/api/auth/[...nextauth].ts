import { client } from "@/lib/apolloClient";
import { prismaClient } from "@/lib/prismaClient";
import { GET_CURRENT_USER } from "@/queries";
import { User } from "@prisma/client";
import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// /**
//  * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
//  * object and keep type safety.
//  *
//  * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
//  */
declare module "next-auth" {
  interface Session {
    user: AnilistUser;
    accessToken: string;
  }

  interface Profile extends AnilistUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    user: AnilistUser;
    accessToken: string;
  }
}

export interface AnilistUser {
  id: number;
  name: string;
  avatar: {
    large: string;
    medium: string;
  };
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    {
      id: "AniListProvider",
      name: "AniList",
      type: "oauth",
      token: "https://anilist.co/api/v2/oauth/token",
      authorization: {
        url: "https://anilist.co/api/v2/oauth/authorize",
        params: { scope: "", response_type: "code" },
      },
      userinfo: {
        url: process.env.GRAPHQL_ENDPOINT,
        async request({ tokens }) {
          const { data } = await client.query({
            query: GET_CURRENT_USER,
            context: {
              headers: {
                Authorization: "Bearer " + tokens.access_token,
              },
            },
          });

          const user = await prismaClient.user.findUnique({
            where: {
              id: data.Viewer.id as number,
            },
          });

          if (!user) {
            await prismaClient.user.create({
              data: {
                id: data.Viewer.id as number,
                name: data.Viewer.name as string,
              },
            });
          }

          prismaClient.$disconnect();

          return data.Viewer as AnilistUser;
        },
      },
      clientId: process.env.ANILIST_ID,
      clientSecret: process.env.ANILIST_SECRET,
      profile(profile, tokens) {
        return {
          id: profile.id,
          name: profile.name,
          avatar: profile.avatar,
        };
      },
    },
  ],
  session: {
    //Sets the session to use JSON Web Token
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account?.access_token!;
      }
      if (profile) {
        token.user = {
          id: profile.id,
          name: profile.name!,
          avatar: profile.avatar,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export default NextAuth(authOptions);
