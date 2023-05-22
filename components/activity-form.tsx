"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Template, Timezone } from "@prisma/client";
import { Combobox } from "./ui/combobox";
import { Textarea } from "./ui/textarea";
import { DatePicker } from "./ui/date-picker";
import { prismaClient } from "@/lib/prismaClient";

interface ActivityFormProps extends React.HTMLAttributes<HTMLDivElement> {
  templates?: Template[];
  timezones?: Timezone[];
}

export function ActivityForm({
  templates,
  timezones,
  className,
  ...props
}: ActivityFormProps) {
  const [splittedTemplate, setSplittedTemplate] = React.useState<string[]>();
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>();
  const [selectedTimezone, setSelectedTimezone] = React.useState<string>();
  const [text, setText] = React.useState<string[]>();
  const [inputs, setInputs] = React.useState<string[]>([]);
  const [inputValues, setInputValues] = React.useState<
    { id: string; value: string }[]
  >([]);

  const getCron = () => {
    const timeSplitted = time.split(":");
    const hours = timeSplitted[0];
    const minutes = timeSplitted[1];

    const day = date?.getDate();
    const month = date?.getMonth()! + 1;
    const year = date?.getFullYear();

    return `${minutes} ${hours} ${day} ${month} * ${year}`;
  };

  const getCurrentTime = React.useMemo(() => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const [date, setDate] = React.useState<Date>();

  const [time, setTime] = React.useState<string>(getCurrentTime);
  // console.log(text.split(/%/g))
  // console.log(text.split(/%[a-zA-Z]+%/g))

  const replace = React.useCallback(() => {
    if (splittedTemplate) {
      let aux = [...splittedTemplate];
      splittedTemplate?.map((t) => {
        const input = inputValues.find((i) => t === i.id);
        if (input) {
          aux[splittedTemplate.indexOf(t)] = input.value;
        }
      });

      setText(aux);
    }
  }, [inputValues, splittedTemplate]);

  React.useEffect(() => {
    replace();
  }, [inputValues, replace]);

  return (
    <div>
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Create Activity</h1>
        <Select
          onValueChange={(ev) => {
            const splitTemplate = ev.split(/%/g);
            const inputs = splitTemplate.filter((_, index) => index % 2 === 1);

            setSelectedTemplate(ev);
            setSplittedTemplate(splitTemplate);
            // TODO: crear los campos necesarios para el template
            setInputs(inputs);
            // TODO: setear el texto con el template en el preview
            setText(splitTemplate);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Template" />
          </SelectTrigger>
          <SelectContent>
            {templates?.map((template: Template) => (
              <SelectItem key={template.id} value={template.value}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <section className="grid grid-cols-2 mt-2 gap-4">
        <div>
          {text && (
            <Textarea
              className="container min-h-full"
              value={text.join("")}
              onChange={(ev) => {
                setText(ev.target.value.split(/%/g));
              }}
            />
          )}
        </div>
        <div className="mx-auto w-full max-w-sm">
          {inputs.map((label) => (
            // TODO: Añadir mas informacion a los campos, por ejemplo podriamos hacer
            // que al crear los campos de la plantilla estos puedan configurarse por tipo,
            // asi tendriamos campos como el de serie: donde podriamos llamar a la api de anilist
            // y traernos el link, en vez de hacer que el usuario tenga que ir a anilist a cogerlo
            <div className="grid items-center gap-1.5 mb-2" key={label}>
              <Label htmlFor={label}>{label}</Label>
              <div className="flex items-center">
                <Input
                  id={label}
                  onChange={(ev) => {
                    const existsInArray = inputValues.find(
                      (i) => i.id === label
                    );

                    setInputValues((prev) =>
                      existsInArray
                        ? prev.map((i) =>
                            i.id === label
                              ? { ...i, value: ev.target.value }
                              : i
                          )
                        : [...prev, { id: label, value: ev.target.value }]
                    );
                  }}
                />
              </div>
            </div>
          ))}
          <form
            onSubmit={async (ev) => {
              ev.preventDefault();
              console.log(text?.join(""));

              let timezoneRes = await fetch(
                "http://localhost:3000/api/timezone",
                {
                  method: "POST",
                  body: JSON.stringify({
                    value: selectedTimezone,
                  }),
                }
              );

              let timezone = await timezoneRes.json();

              fetch("http://localhost:3000/api/activity", {
                method: "POST",
                body: JSON.stringify({
                  cron: getCron(),
                  text: text?.join(""),
                  timezone_from: 2,
                  timezone: timezone.value,
                }),
              })
                .then((res) => res.json())
                .then(console.log);
            }}
          >
            <div className="">
              <div className="flex items-center gap-4 mb-4">
                <DatePicker
                  onSelect={(value) => {
                    console.log({ value });
                    setDate(value);
                    console.log({
                      day: value?.getDate(),
                      month: value?.getMonth()! + 1,
                      year: value?.getFullYear(),
                    });
                  }}
                />
                <Input
                  type="time"
                  value={time}
                  onChange={(ev) => setTime(ev.target.value)}
                />
              </div>
              {/* <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea>
                    {
                      [0,1,2,3,4,5,6,7,8,9,10,11,12].map((i) => (
                        <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
                      ))
                    }
                  </ScrollArea>
                </SelectContent>
              </Select> */}

              <Combobox
                placeholder="Select Timezone"
                searchPlaceholder="Search timezone..."
                noDataPlaceholder="No timezone found."
                data={timezones!.map((tz) => ({
                  label: tz.name,
                  value: tz.value,
                }))}
                onSelect={(value) => {
                  setSelectedTimezone(value);
                }}
              />
            </div>
            {text && (
              <Button className="mt-4" type="submit">
                Set Schedule
              </Button>
            )}
            <Button className="mt-4 w-full" type="submit">
              Set Schedule
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
