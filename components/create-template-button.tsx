"use client"

import { Plus } from "lucide-react";
import { Button } from "./ui/button";

export function CreateTemplateButton() {
  return (
    <Button className="h-8 w-8 p-0 rounded-full" onClick={() => {
      console.log('create template')
      // TODO: Show create template form
    }}>
      <Plus size={20} />
    </Button>
  )
}