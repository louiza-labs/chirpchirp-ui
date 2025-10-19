"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bird } from "lucide-react";

interface Species {
  species: string;
  count: number;
  image?: string;
}

interface SpeciesWithTemp extends Species {
  avgTemp: number | null;
}

interface SpeciesListProps {
  species: Species[];
  speciesWithTemp: SpeciesWithTemp[];
  totalSightings: number;
}

export default function SpeciesList({
  species,
  speciesWithTemp,
  totalSightings,
}: SpeciesListProps) {
  const scrollToSpecies = (speciesName: string) => {
    const element = document.getElementById(
      `species-${speciesName.replace(/\s+/g, "-").toLowerCase()}`
    );
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {species.map((s: Species, index: number) => (
        <button
          key={s.species}
          onClick={() => scrollToSpecies(s.species)}
          className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer text-left w-full group"
        >
          <div className="flex-shrink-0 relative">
            {s.image ? (
              <Avatar className="h-14 w-14 ring-2 ring-offset-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all">
                <AvatarImage src={s.image} />
                <AvatarFallback>{s.species[0]}</AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-all">
                <Bird className="h-6 w-6 text-gray-500" />
              </div>
            )}
            {index < 3 && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {s.species}
            </h3>
            <p className="text-sm text-gray-600">
              {s.count} {s.count === 1 ? "sighting" : "sightings"}
            </p>
            {speciesWithTemp.find(
              (st: SpeciesWithTemp) => st.species === s.species
            )?.avgTemp && (
              <p className="text-xs text-gray-500">
                Avg temp:{" "}
                {speciesWithTemp
                  .find((st: SpeciesWithTemp) => st.species === s.species)
                  ?.avgTemp?.toFixed(1)}
                °F
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <div className="text-2xl font-bold text-blue-600 group-hover:scale-110 transition-transform">
              {((s.count / totalSightings) * 100).toFixed(0)}%
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
