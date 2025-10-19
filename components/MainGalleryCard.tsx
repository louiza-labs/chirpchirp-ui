"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, Share2 } from "lucide-react";
import Image from "next/image";

import { birdAvatars } from "@/lib/birdAvatars";
import type { MainGalleryCardProps } from "@/types";

const MainGalleryCard = ({
  taken_on,
  file_name,
  image_url,
  temperature,
  attributions,
}: MainGalleryCardProps) => {
  const hasAttributions = !!attributions.length;
  const attributionsData = hasAttributions ? attributions[0] : { species: "" };
  const dateObj = new Date(taken_on);
  const species = attributionsData.species;
  const hasBirdAvatar = !!birdAvatars[species];

  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    // year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(image_url);
      // Could add toast notification here
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${species} - Bird Photo`,
          text: `Check out this ${species} spotted on ${formattedDate}`,
          url: image_url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback to copy URL
      handleCopy();
    }
  };

  return (
    <Card className="overflow-hidden border border-gray-200/60 shadow-lg shadow-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
      <CardHeader>
        <div className="flex flex-row items-center gap-x-3">
          {hasBirdAvatar ? (
            <Avatar className="ring-2 ring-offset-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all">
              <AvatarImage src={birdAvatars[species]} />
              <AvatarFallback>Bird</AvatarFallback>
            </Avatar>
          ) : null}
          <CardTitle className="font-bold tracking-tight text-gray-900">
            {attributionsData.species}
          </CardTitle>
        </div>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleCopy}
            className="hover:bg-gray-100"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleShare}
            className="hover:bg-gray-100"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-video w-full h-fit overflow-hidden group">
          <Image
            className="rounded-none object-cover group-hover:scale-105 transition-transform duration-500"
            src={image_url}
            alt={file_name || "Gallery image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-row justify-between items-center gap-2 py-1">
        <div className="text-sm text-gray-600 font-medium">
          Taken at {formattedDate}
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap shadow-sm border border-orange-200/50">
          🌡️{temperature} F
        </div>
      </CardFooter>
    </Card>
  );
};

export default MainGalleryCard;
