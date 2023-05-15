"use client"

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table"
import { Edit2, Trash2 } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Template = {
  id: string;
  name: string;
  description: string;
  value: string;
}

export const columns: ColumnDef<Template>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: (props) => <code className="text-xs">{props.row.getValue("value")}</code>
  },
  {
    id: "actions",
    cell: (props) => (
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          onClick={() => {
            console.log("edit", props.row.original)
          }}
        >
          <Edit2 size={16} />
        </Button>
        <Button
          variant="ghost"
          onClick={() => {

            console.log("delete", props.row.original)
          }}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    )
  }
]

export const templates: Template[] = [
  {
    id: "1",
    name: "Fanart of the day",
    description: "Fanart with image and link to the anime",
    value: "~~~╔══════ ≪ •❈• ≫ ══════╗~~~\n# ~~~__  FANART OF THE DAY__~~~\n~~~╚══════ ≪ •❈• ≫ ══════╝~~~\n~~~ img350(https://i.pinimg.com/564x/11/94/3a/11943a429900aab775642391f3a14509.jpg)  ~~~\n\n~~~https://anilist.co/anime/21858/Little-Witch-Academia-TV/ ~~~\n ~~~ [korolanada](https://www.pixiv.net/en/artworks/62035811) ~~~"
  }
]