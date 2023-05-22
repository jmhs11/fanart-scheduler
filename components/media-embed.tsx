"use client";

import { client, clientAuth } from "@/lib/apolloClient";
import { GET_MEDIA } from "@/queries";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

interface MediaEmbedProps extends React.HTMLAttributes<HTMLDivElement> {
  mediaLink: string;
  session: Session | null;
}

export default function MediaEmbed({ mediaLink, session }: MediaEmbedProps) {
  // mediaLink example: https://anilist.co/anime/143270/Lycoris-Recoil
  const [media, setMedia] = React.useState<any>();

  useEffect(() => {
    const getMedia = async () => {
      const mediaLinkSplitted = mediaLink.split("/");
      const mediaId = mediaLinkSplitted[mediaLinkSplitted.length - 2];
      const mediaType = mediaLinkSplitted[mediaLinkSplitted.length - 3];

      const { data } = await clientAuth(session?.accessToken!).query({
        query: GET_MEDIA,
        variables: {
          id: mediaId,
          type: mediaType.toUpperCase(),
        },
      });

      setMedia(data.Media);
    };
    getMedia();
  }, [mediaLink, session?.accessToken]);

  return (
    media && (
      <Link
        href={mediaLink}
        className="border-transparent bg-black bg-opacity-10 [&_#genres]:hover:opacity-100 [&_span]:hover:opacity-0 rounded-md overflow-hidden inline-grid h-16 w-auto max-w-[550px] min-h-16 text-sm leading-[18px]"
        style={{ gridTemplateColumns: "50px auto" }}
      >
        {/* <div style={{backgroundImage: media.coverImage.medium}} className="bg-cover bg-no-repeat bg-center"/> */}
        <Image
          src={media.coverImage.medium}
          alt={media.title.romaji}
          width={50}
          height={64}
          className="h-16"
        />
        <div className="py-[10px] pr-4 pl-3 overflow-hidden">
          <h3 className="text-[13px] font-medium truncate -mb-[10px]">
            {media.title.romaji}
          </h3>
          <div className="text-[12px] relative [&>*]:duration-200 [&>span]:opacity-100">
            <p
              id="genres"
              className="opacity-0 relative min-h-[18px] min-w-[14px] top-[18px]"
            >
              {media.genres.join(", ")}
            </p>
            <span className="capitalize">
              {["TV", "ONA", "ONA"].includes(media.format)
                ? media.format
                : media.format.replace("_", " ").toLowerCase()}{" "}
              ·{" "}
            </span>
            <span className="capitalize">{media.status.toLowerCase()} · </span>
            <span className="capitalize">
              {`${media.season.toLowerCase()} ${media.seasonYear}`} ·{" "}
            </span>
            <span>{media.meanScore}% </span>
          </div>
        </div>
      </Link>
    )
  );
}
