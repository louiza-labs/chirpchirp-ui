"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Species {
  species: string;
  image?: string;
  count: number;
}

interface SpeciesCarouselProps {
  speciesList: Species[];
  itemsPerPage?: number;
}

const SpeciesCarousel = ({
  speciesList,
  itemsPerPage = 8,
}: SpeciesCarouselProps) => {
  const [startIndex, setStartIndex] = useState(0);

  const filteredSpecies = speciesList.filter((species) => species.image);
  const totalItems = filteredSpecies.length;

  // Create infinite loop by wrapping around
  const visibleSpecies = Array.from({ length: itemsPerPage }, (_, i) => {
    const index = (startIndex + i) % totalItems;
    return filteredSpecies[index];
  });

  const handlePrevious = () => {
    setStartIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % totalItems);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          className="flex-shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex-1 overflow-hidden">
          <div className="flex flex-row gap-6 py-4 px-2">
            {visibleSpecies.map((species) => (
              <div
                key={species.species}
                className="w-28  relative items-center flex flex-col"
              >
                <div className="flex-shrink-0 ">
                  <Avatar className="shadow-md ring-offset-1 w-18 h-18 hover:ring-blue-500/40 transition-all cursor-pointer">
                    <AvatarImage src={species.image} />
                    <AvatarFallback>{species.species}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="mt-2 flex flex-col justify-center items-center">
                  <p className="text-xs font-medium break-all">
                    {species.species}
                  </p>
                </div>
                <div className=" absolute top-0 right-0 bg-green-400 w-6 h-6 flex items-center justify-center p-1 rounded-full">
                  <span className="text-white text-xs">{species.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className="flex-shrink-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SpeciesCarousel;
