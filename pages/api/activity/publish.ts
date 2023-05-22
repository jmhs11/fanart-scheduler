import { clientAuth } from "@/lib/apolloClient";
import { prismaClient } from "@/lib/prismaClient";
import SAVE_TEXT_ACTIVITY from "@/queries/SAVE_TEXT_ACTIVITY";
import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "next-auth";

interface TokenUser extends User {
  token: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    let activity = await prismaClient.activity.findFirst({
      where: {
        id: req.query.id as string,
      },
    })

    if (!activity) {
      res.status(404).send({
        error: "Activity not found",
      });
    }

    const response = await clientAuth(activity!.token).query({
      query: SAVE_TEXT_ACTIVITY,
      variables: {
        text: activity!.value,
      },
    });

    console.log({response})

    await fetch(`https://www.easycron.com/rest/delete?token=${process.env.EASYCRON_TOKEN}&id=${activity?.cronId}`)

    res.send({
      content:
        "This is protected content. You can access this content because you are signed in.",
    });
  } else {
    res.status(405).send({
      error: `HTTP ${req.method} method is not supported for this endpoint`,
    });
  }
}
