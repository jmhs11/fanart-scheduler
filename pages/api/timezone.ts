import { prismaClient } from "@/lib/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const timezones = await prismaClient.timezone.findMany();
      res.status(200).json(timezones);
      break;
    case "POST":
      const body = JSON.parse(req.body);
      const newTimezone = await prismaClient.timezone.findFirst({
        where: {
          value: body.value,
        },
      });

      res.status(200).json(newTimezone);
  }
}
