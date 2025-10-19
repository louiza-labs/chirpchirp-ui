import MainGalleryCard from "@/components/MainGalleryCard";
import { fetchImagesWithAttribution } from "@/lib/data";
import Image from "next/image";
export default async function Home() {
  const images = await fetchImagesWithAttribution();
  return (
    <div className="font-sans grid  min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="grid xl:grid-cols-2 grid-cols-1 w-full h-full gap-10">
          {images.map((image, index) => (
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
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
