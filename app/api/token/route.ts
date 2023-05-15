import { redirect } from "next/dist/server/api-utils";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get("code");

	const res = await fetch(`https://anilist.co/api/v2/oauth/token`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			grant_type: "authorization_code",
			client_id: process.env.ANILIST_ID,
			client_secret: process.env.ANILIST_SECRET,
			redirect_uri: "http://localhost:3000/api/token",
			code,
		}),
	});

	const data = await res.json();

	const response = new Response("ok", {
		status: 200,
		headers: { "Set-Cookie": `token=${data.access_token};Max-Age=${data.expires};HttpOnly` },
	});

	return redirect(response, "/")
}
