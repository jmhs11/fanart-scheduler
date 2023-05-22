import { CreateTemplateButton } from "@/components/create-template-button";
import { prismaClient } from "@/lib/prismaClient";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import Link from "next/link";

export const metadata = {
  title: "Templates",
};

async function getTemplates(userId?: number) {
  let user = await prismaClient.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      templates: true,
    },
  });

  return user?.templates;
}

export default async function Templates() {
  const session = await getServerSession(authOptions);
  const data = await getTemplates(session?.user.id);

  return (
    <div className="">
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl flex">Templates</h1>
        <Link href="/templates/new">
          <CreateTemplateButton />
        </Link>
      </div>
      <div className="pt-4">
        <DataTable columns={columns} data={data || []} />
      </div>
    </div>
  );
}
