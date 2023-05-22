import { prismaClient } from "@/lib/prismaClient";
import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { Prisma } from "@prisma/client";

interface TokenUser extends User {
  token: string;
}
// TODO: Error management
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return await postHandler(req, res);
    case "GET":
      return await getHandler(req, res);
    case "DELETE":
      return await deleteHandler(req, res);
    default:
      res.status(405).send({
        error: `HTTP ${req.method} method is not supported for this endpoint`,
      });
      break;
  }
}

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
  const deletedActivity = await prismaClient.activity.delete({
    where: {
      id: req.query.id as string,
    },
  });

  const url = new URL("https://www.easycron.com/rest/delete");
  url.searchParams.set("token", process.env.EASYCRON_TOKEN!);
  url.searchParams.set("id", deletedActivity.cronId as string);

  const easyCronDeleteRes = await fetch(url.toString());
  const easyCronDeleteData = await easyCronDeleteRes.json();

  console.log({ deletedActivity, easyCronDeleteData });

  res.status(200);
}

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  const body = JSON.parse(req.body);

  const activity = {
    id: crypto.randomUUID(),
    value: body.text as string,
    token: session?.accessToken,
  };

  if (session) {
    const url = new URL("https://www.easycron.com/rest/add");
    url.searchParams.set("token", process.env.EASYCRON_TOKEN!);
    url.searchParams.set(
      "url",
      `https://anilist-scheduler.kuuro.dev/api/publish?id=${activity.id}`
    );

      console.log({body})

    url.searchParams.set("cron_expression", body.cron);
    url.searchParams.set("cron_job_name", body.name || "AniList Scheduler");
    url.searchParams.set("timezone_from", "2");
    url.searchParams.set("timezone", body.timezone);
    url.searchParams.set("status", "0"); // TODO: change to 1 when ready

    const easyCronRes = await fetch(url.toString());
    const easyCronData = await easyCronRes.json();

    const newActivity = await prismaClient.activity.create({
      data: {
        ...activity,
        cronId: easyCronData.cron_job_id as string,
      } as Prisma.ActivityCreateInput,
    });
  
    console.log({ newActivity });

    res.send({
      easyCronData,
    });
  } else {
    res.send({
      error:
        "You must be signed in to view the protected content on this page.",
    });
  }
}

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    const activities = await prismaClient.activity.findMany({
      where: {
        token: session?.accessToken,
      },
    });
    res.send({
      activities,
    });
  } else {
    res.send({
      error:
        "You must be signed in to view the protected content on this page.",
    });
  }
}
