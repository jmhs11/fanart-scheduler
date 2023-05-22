import { NewTemplateForm } from "@/components/new-template-form";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export const metadata = {
  title: "New Template",
};

export default async function NewTemplate() {
  const session = await getServerSession(authOptions);

  // await prismaClient.template.create({
  //   data: {
  //     userId: (session?.user as SessionUser).id,
  //     name: "Fanart of the day",
  //     description: "Fanart with image and link to the anime",
  //     value: "~~~╔══════ ≪ •❈• ≫ ══════╗~~~\n# ~~~__  FANART OF THE DAY__~~~\n~~~╚══════ ≪ •❈• ≫ ══════╝~~~\n~~~ img350(https://i.pinimg.com/564x/11/94/3a/11943a429900aab775642391f3a14509.jpg)  ~~~\n\n~~~https://anilist.co/anime/21858/Little-Witch-Academia-TV/ ~~~\n ~~~ [korolanada](https://www.pixiv.net/en/artworks/62035811) ~~~"
  //   },
  // });

  return (
    <div className="">
      <h1 className="text-2xl">New Template</h1>
      <NewTemplateForm session={session} />
    </div>
  );
}
