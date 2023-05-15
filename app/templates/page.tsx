import { CreateTemplateButton } from "@/components/create-template-button";
import { Template, columns } from "./columns";
import { DataTable } from "./data-table";

export const metadata = {
  title: 'Templates',
}

async function getData(): Promise<Template[]> {
  // const res = fetch("http://localhost:3000/api/templates")
  return [
    {
      "id": "1",
      "name": "Fanart of the day",
      "description": "Fanart with image and link to the anime",
      "value": "~~~╔══════ ≪ •❈• ≫ ══════╗~~~\n# ~~~__  FANART OF THE DAY__~~~\n~~~╚══════ ≪ •❈• ≫ ══════╝~~~\n~~~ img350(%fanart%)  ~~~\n\n~~~%serie% ~~~\n ~~~ [%artist%](%fanartLink%) ~~~"
    }

  ]
}

export default async function Templates() {
  const data = await getData()

  return <div className="container">
    <div className="flex items-center space-x-2">
      <h1 className="text-2xl flex">Templates</h1>
      <CreateTemplateButton />
    </div>
    <div className="pt-4">

      <DataTable columns={columns} data={data} />
    </div>
  </div>
}