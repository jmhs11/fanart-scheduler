"use client";

import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import MediaEmbed from "./media-embed";
import { Session } from "next-auth";
import { ActivityPreview } from "./activity-preview";
import remarkGfm from "remark-gfm";

interface NewTemplateFormProps extends React.HTMLAttributes<HTMLFormElement> {
  session: Session | null;
}

export function NewTemplateForm({ session }: NewTemplateFormProps) {
  const [textarea, setTextarea] = useState("");

  return (
    <form className="flex flex-col mx-auto gap-2">
      <div className="grid grid-cols-2 gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" type="text" className="row-start-2" />
        <Label htmlFor="description" className="col-start-2">
          Description
        </Label>
        <Input
          id="description"
          className="col-start-2 row-start-2"
          type="text"
        />
        <Label htmlFor="template" className="row-start-3">
          Template
        </Label>
        <Textarea
          id="template"
          className="w-full h-40 row-start-4"
          value={textarea}
          onChange={(e) => setTextarea(e.target.value)}
        />
        {textarea && (
          <>
            <Label htmlFor="preview" className="row-start-3">
              Preview
            </Label>
            <ActivityPreview
              className="row-start-3 row-end-5 col-start-4"
              session={session}
              text={""}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: (props) => {
                    return new RegExp(/((http|https):\/\/)anilist\.co\/(?:anime|manga)\/\d+\/[a-zA-Z0-9-]+\/?/gi).test(props.href || "") ? (
                      <MediaEmbed session={session} mediaLink={props.href!} /> // Render Twitter links with custom component
                    ) : (
                      <a href={props.href}>{props.children}</a> // All other links
                    );
                  },
                }}
              >
                {textarea}
              </ReactMarkdown>
            </ActivityPreview>
          </>
        )}
      </div>
    </form>
  );
}
