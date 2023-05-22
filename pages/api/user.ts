import { prismaClient } from "@/lib/prismaClient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const user = await prismaClient.user.findFirst({
        where: {
          id: Number(req.query.id),
        },
      });

      res.status(200).send({
        data: user,
      });
      break;
    case "POST":
      const newUser = await prismaClient.user.create({
        data: req.body.user,
      });

      res.status(201).send({
        newUser,
      });
      break;
    case "PUT":
      break;
    case "DELETE":
      await prismaClient.user.delete({
        where: {
          id: Number(req.query.id),
        },
      });

      res.status(200);
      break;
    default:
      res.status(405).send({
        error: `HTTP ${req.method} method is not supported for this endpoint`,
      });
      break;
  }
}
