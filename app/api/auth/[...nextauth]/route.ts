import { client } from "@/lib/apolloClient";
import { GET_CURRENT_USER } from "@/queries";
import NextAuth, { AuthOptions } from "next-auth";

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
				async request(context) {
					const { data } = await client.query({
						query: GET_CURRENT_USER,
						context: {
							headers: {
								Authorization: "Bearer " + context.tokens.access_token,
							},
						},
					});

					return {
						token: context.tokens.access_token,
						name: data.Viewer.name,
						sub: data.Viewer.id,
						image: data.Viewer.avatar,
					};
				},
			},
			clientId: process.env.ANILIST_ID,
			clientSecret: process.env.ANILIST_SECRET,
			profile(profile) {
				console.log(profile);
				return {
					token: profile.token,
					id: profile.sub,
					name: profile?.name,
					image: profile.image,
				};
			},
		},
	],
	session: {
		//Sets the session to use JSON Web Token
		strategy: "jwt",
	},
	callbacks: {
		async jwt({ token, user }) {
			return { ...token, ...user };
		},
		async session({ session, token, user }) {
			session.user = token;
			return session;
		},
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
