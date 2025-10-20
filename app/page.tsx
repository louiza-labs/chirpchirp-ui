import MainGalleryCard from "@/components/MainGalleryCard";
import SpeciesCarousel from "@/components/SpeciesCarousel";
import { fetchImagesWithAttribution, fetchListOfSpecies } from "@/lib/data";
import type { MainGalleryCardProps } from "@/types";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ species?: string }>;
}) {
  const params = await searchParams;
  const selectedSpecies = params.species;
  const images = await fetchImagesWithAttribution({
    imageId: "",
    species: selectedSpecies,
  });
  const species = await fetchListOfSpecies();
  return (
    <div className="font-sans grid  min-h-screen p-8 pb-20 gap-16 sm:px-10">
      <main className="flex flex-col gap-[32px] row-start-1 items-center sm:items-start overflow-auto">
        <div className="w-full overflow-clip">
          <SpeciesCarousel
            speciesList={species}
            selectedSpecies={selectedSpecies}
          />
        </div>
        <div className="grid xl:grid-cols-2 sm:grid-cols-3 grid-cols-1 w-full h-full gap-10">
          {images.map((image: MainGalleryCardProps) => (
            <MainGalleryCard
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
              key={image.id}
            />
          ))}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
