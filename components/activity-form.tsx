"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "./icons"
import { Textarea } from "./ui/textarea"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Template } from "@/app/templates/columns"

interface ActivityFormProps extends React.HTMLAttributes<HTMLDivElement> {
  templates?: Template[]
}

export function ActivityForm({ templates, className, ...props }: ActivityFormProps) {
  const [text, setText] = React.useState<string>("")
  const [inputs, setInputs] = React.useState<string[]>([])

  // console.log(text.split(/%/g))
  // console.log(text.split(/%[a-zA-Z]+%/g))

  console.log(inputs)

  return (
    <form>
      <Select onValueChange={(ev) => {
        // TODO: crear los campos necesarios para el template
        setInputs(ev.split(/%/g).filter((_, index) => index % 2 === 1))
        // TODO: setear el texto con el template en el preview
        setText(ev)
      }}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Template" />
        </SelectTrigger>
        <SelectContent>
          {templates?.map((template: Template) => (
            <SelectItem key={template.id} value={template.value}>{template.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className={cn("pt-4 grid gap-6", className)} {...props}>
        <Textarea className="container" value={text} onChange={(ev) => {
          setText(ev.target.value)
        }} />
        {inputs.map((label) => (
          <div className="grid w-full max-w-sm items-center gap-1.5" key={label}>
            <Label htmlFor={label}>{label}</Label>
            <Input id={label} onChange={(ev) => {
              setText(text.replace(`%${label}%`, ev.target.value))
            }} />
          </div>
        ))}
        {/* <pre className="overflow-hidden whitespace-pre-wrap">{JSON.stringify(text, null, 2)}</pre> */}
      </div>
    </form>
  )
}