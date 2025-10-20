"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Species {
  species: string;
  image?: string;
  count: number;
}

interface SpeciesCarouselProps {
  speciesList: Species[];
  itemsPerPage?: number;
  selectedSpecies?: string;
}

const SpeciesCarousel = ({
  speciesList,
  itemsPerPage,
  selectedSpecies,
}: SpeciesCarouselProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [startIndex, setStartIndex] = useState(0);
  const [dynamicItemsPerPage, setDynamicItemsPerPage] = useState(6);

  // Update items per page based on window width
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      let items: number;

      if (width < 640) {
        // mobile: 2-3 items
        items = 2;
      } else if (width < 768) {
        // sm: 3-4 items
        items = 3;
      } else if (width < 1024) {
        // md: 4-5 items
        items = 4;
      } else if (width < 1280) {
        // lg: 6 items
        items = 6;
      } else if (width < 1536) {
        // xl: 8 items
        items = 8;
      } else {
        // 2xl: 10 items
        items = 10;
      }

      setDynamicItemsPerPage(itemsPerPage ?? items);
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, [itemsPerPage]);

  const filteredSpecies = speciesList.filter((species) => species.image);
  const totalItems = filteredSpecies.length;

  // Create infinite loop by wrapping around
  const visibleSpecies = Array.from({ length: dynamicItemsPerPage }, (_, i) => {
    const index = (startIndex + i) % totalItems;
    return filteredSpecies[index];
  });

  const handlePrevious = () => {
    setStartIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % totalItems);
  };

  const handleSpeciesClick = (speciesName: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // If already selected, remove it (toggle off)
    if (selectedSpecies === speciesName) {
      params.delete("species");
    } else {
      // Otherwise, set the new species
      params.set("species", speciesName);
    }

    router.push(`/?${params.toString()}`);
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
          <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-6 py-4 px-2">
            {visibleSpecies.map((species) => {
              const isSelected = selectedSpecies === species.species;
              return (
                <div
                  key={species.species}
                  className="w-20 sm:w-24 md:w-28 lg:w-32 relative items-center flex flex-col flex-shrink-0"
                >
                  <div className="flex-shrink-0">
                    <Avatar
                      onClick={() => handleSpeciesClick(species.species)}
                      className={`shadow-md ring-offset-1 w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 hover:ring-blue-500/40 transition-all cursor-pointer ${
                        isSelected ? "ring-2 ring-blue-500" : ""
                      }`}
                    >
                      <AvatarImage src={species.image} />
                      <AvatarFallback>{species.species}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="mt-1 sm:mt-2 flex flex-col justify-center items-center w-full">
                    <p className="text-[10px] sm:text-xs font-medium text-center line-clamp-2 px-1">
                      {species.species}
                    </p>
                  </div>
                  <div className="absolute -top-1 -right-1 bg-green-400 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full">
                    <span className="text-white text-[10px] sm:text-xs font-semibold">
                      {species.count}
                    </span>
                  </div>
                </div>
              );
            })}
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
