import MainGalleryCard from "@/components/MainGalleryCard";
import SpeciesList from "@/components/SpeciesList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchImagesWithAttribution, fetchListOfSpecies } from "@/lib/data";
import { Award, Bird, Sparkles, TrendingUp } from "lucide-react";

interface Species {
  species: string;
  count: number;
  image?: string;
}

interface SpeciesWithTemp extends Species {
  avgTemp: number | null;
}

interface Attribution {
  species: string;
  confidence: number;
  model_version: string;
}

interface ImageData {
  id: string;
  taken_on: string;
  stored_on: string;
  created_at: string;
  file_name: string;
  local_file_name: string;
  image_size: number;
  image_url: string;
  download_url: string;
  enhanced_image_url: string;
  camera_id: number;
  camera_name: string;
  modem_meid: string;
  latitude: number;
  longitude: number;
  is_video: boolean;
  video_url: string | null;
  user_id: number;
  is_favorite: boolean;
  temperature: string;
  moon_phase: string;
  tags: string[];
  attributions: Attribution[];
}

export default async function SpeciesPage() {
  const species = await fetchListOfSpecies();
  const allImages = await fetchImagesWithAttribution();

  // Calculate insights
  const totalSpecies = species.length;
  const totalSightings = species.reduce(
    (sum: number, s: Species) => sum + s.count,
    0
  );
  const topSpecies = species[0];
  const rareSpecies = species.filter((s: Species) => s.count === 1);

  // Get species with temperature data
  const speciesWithTemp: SpeciesWithTemp[] = species.map((s: Species) => {
    const speciesImages = allImages.filter(
      (img: ImageData) =>
        img.attributions.length > 0 && img.attributions[0].species === s.species
    );
    const temps = speciesImages
      .map((img: ImageData) => img.temperature)
      .filter((t: string) => t !== null && t !== undefined);
    const avgTemp =
      temps.length > 0
        ? temps.reduce((sum: number, t: string) => sum + parseFloat(t), 0) /
          temps.length
        : null;
    return { ...s, avgTemp };
  });

  // Find warmest and coldest species
  const speciesWithValidTemp = speciesWithTemp.filter(
    (s: SpeciesWithTemp) => s.avgTemp !== null
  );
  const warmestSpecies = speciesWithValidTemp.reduce(
    (max: SpeciesWithTemp, s: SpeciesWithTemp) =>
      s.avgTemp! > (max.avgTemp || 0) ? s : max,
    speciesWithValidTemp[0] || null
  );
  const coldestSpecies = speciesWithValidTemp.reduce(
    (min: SpeciesWithTemp, s: SpeciesWithTemp) =>
      s.avgTemp! < (min.avgTemp || Infinity) ? s : min,
    speciesWithValidTemp[0] || null
  );

  return (
    <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:px-20">
      <main className="flex flex-col gap-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Species Breakdown
          </h1>
          <p className="text-gray-600">
            Discover insights about the birds visiting your feeders
          </p>
        </div>

        {/* Key Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Bird className="h-4 w-4" />
                Total Species
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {totalSpecies}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Different species identified
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Total Sightings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {totalSightings}
              </div>
              <p className="text-xs text-gray-500 mt-1">Bird visits recorded</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Most Popular
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-yellow-700 truncate">
                {topSpecies?.species || "N/A"}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {topSpecies?.count} sightings
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Rare Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {rareSpecies.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Species seen only once
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Fun Insights */}
        {warmestSpecies && coldestSpecies && (
          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                🌡️ Temperature Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-orange-600">
                  {warmestSpecies.species}
                </span>{" "}
                prefer warmer weather, averaging{" "}
                <span className="font-bold">
                  {warmestSpecies.avgTemp?.toFixed(1)}°F
                </span>
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-blue-600">
                  {coldestSpecies.species}
                </span>{" "}
                are cold weather champions, spotted at{" "}
                <span className="font-bold">
                  {coldestSpecies.avgTemp?.toFixed(1)}°F
                </span>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Species List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              All Species ({totalSpecies})
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Click on any species to view their gallery
            </p>
          </CardHeader>
          <CardContent>
            <SpeciesList
              species={species}
              speciesWithTemp={speciesWithTemp}
              totalSightings={totalSightings}
            />
          </CardContent>
        </Card>

        {/* Gallery Sections by Species */}
        <div className="space-y-12 my-10">
          {species.map((s: Species) => {
            const speciesImages = allImages.filter(
              (img: ImageData) =>
                img.attributions.length > 0 &&
                img.attributions[0].species === s.species
            );

            if (speciesImages.length === 0) return null;

            return (
              <div
                key={s.species}
                id={`species-${s.species.replace(/\s+/g, "-").toLowerCase()}`}
                className="scroll-mt-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {s.species}
                  </h2>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {speciesImages.length}{" "}
                    {speciesImages.length === 1 ? "photo" : "photos"}
                  </span>
                </div>
                <div className="grid xl:grid-cols-2 grid-cols-1 mt-4 lg:grid-cols-3 gap-10">
                  {speciesImages.map((image: ImageData) => (
                    <MainGalleryCard
                      key={image.id}
                      id={image.id}
                      taken_on={image.taken_on}
                      stored_on={image.stored_on}
                      created_at={image.created_at}
                      file_name={image.file_name}
                      local_file_name={image.local_file_name}
                      image_size={image.image_size}
                      image_url={image.image_url}
                      download_url={image.download_url}
                      enhanced_image_url={image.enhanced_image_url}
                      camera_id={image.camera_id}
                      camera_name={image.camera_name}
                      modem_meid={image.modem_meid}
                      latitude={image.latitude}
                      longitude={image.longitude}
                      is_video={image.is_video}
                      video_url={image.video_url}
                      user_id={image.user_id}
                      is_favorite={image.is_favorite}
                      temperature={image.temperature}
                      moon_phase={image.moon_phase}
                      tags={image.tags}
                      attributions={image.attributions}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
