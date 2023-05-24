import { ActivityForm } from "@/components/activity-form";
import { prismaClient } from "@/lib/prismaClient";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

async function getTemplates(userId: number) {
  let user = await prismaClient.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      templates: true,
    },
  });

  return user?.templates!;
}

async function getTimezones() {
  return await prismaClient.timezone.findMany();
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  const templates = await getTemplates(session?.user?.id);
  const timezones = await getTimezones();

  return <ActivityForm templates={templates || []} timezones={timezones} />;
  return (
    <>
      {templates.length > 0 ? (
        <ActivityForm templates={templates} timezones={timezones} />
      ) : (
        <p>No Template</p>
      )}
    </>
  );
}
