"use client"

import { Plus } from "lucide-react";
import { Button } from "./ui/button";

export function CreateTemplateButton() {

  // console.log("create template");
  // await prismaClient.template.create({
  //   data: {
  //     name: "New template",
  //     description: "New template description",
  //     value: "~~~╔══════ ≪ •❈• ≫ ══════╗~~~ # ~~~__ FANART OF THE DAY__~~~ ~~~╚══════ ≪ •❈• ≫ ══════╝~~~ ~~~ img350(%fanart%) ~~~ ~~~%serie% ~~~ ~~~ [%artist%](%fanartLink%) ~~~",
  //     userId: (session?.user as SessionUser).id,
  //   },
  // });
  // // TODO: Show create template form

  return (
    <Button className="h-8 w-8 p-0 rounded-full" >
      <Plus size={20} />
    </Button>
  )
}