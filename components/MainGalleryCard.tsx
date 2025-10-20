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
import { useEffect, useRef, useState } from "react";

import { birdAvatars } from "@/lib/birdAvatars";
import type { MainGalleryCardProps } from "@/types";

const MainGalleryCard = ({
  taken_on,
  file_name,
  image_url,
  temperature,
  attributions,
}: MainGalleryCardProps) => {
  const [showAllAttributions, setShowAllAttributions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasAttributions = !!attributions.length;
  const dateObj = new Date(taken_on);
  const primarySpecies = hasAttributions ? attributions[0].species : "";
  const hasBirdAvatar = !!birdAvatars[primarySpecies];
  const additionalCount = attributions.length - 1;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowAllAttributions(false);
      }
    };

    if (showAllAttributions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAllAttributions]);

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
        const speciesText =
          attributions.length > 1
            ? attributions.map((a) => a.species).join(", ")
            : primarySpecies;
        await navigator.share({
          title: `${speciesText} - Bird Photo`,
          text: `Check out this ${speciesText} spotted on ${formattedDate}`,
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
        <div className="flex flex-row items-center gap-x-3 relative">
          {hasBirdAvatar ? (
            <Avatar className="ring-2 ring-offset-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all">
              <AvatarImage src={birdAvatars[primarySpecies]} />
              <AvatarFallback>Bird</AvatarFallback>
            </Avatar>
          ) : null}
          <div className="flex items-center gap-x-2 relative" ref={dropdownRef}>
            <CardTitle className="font-bold tracking-tight text-gray-900">
              {hasAttributions ? attributions[0].species : "Unknown"}
            </CardTitle>
            {additionalCount > 0 && (
              <>
                <button
                  onClick={() => setShowAllAttributions(!showAllAttributions)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  +{additionalCount} more
                </button>
                {showAllAttributions && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10 min-w-[250px]">
                    <div className="flex flex-col gap-y-2">
                      {attributions.slice(1).map((attr, idx) => (
                        <div
                          key={idx}
                          className="text-sm text-gray-700 flex items-center justify-between gap-x-3"
                        >
                          <span className="font-medium">{attr.species}</span>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {Math.round(attr.confidence * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
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
