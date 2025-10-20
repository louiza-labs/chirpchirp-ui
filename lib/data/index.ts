"use server";

import type { speciesObj } from "@/types";
import axios from "axios";
import { birdAvatars } from "../birdAvatars";
import { CORE_BE_API_URL } from "../constants";

export const fetchImagesWithAttribution = async ({
  imageId = "",
  species = "",
}) => {
  console.log("the species", species);
  // if no image id passed, fetch all images
  if (!imageId) {
    const url = new URL(`${CORE_BE_API_URL}/images`);
    url.searchParams.append("limit", "100");
    if (species) {
      url.searchParams.append("species", species);
    }
    const response = await axios.get(url.toString());
    const { data } = response;

    return data.images;
  } else {
    // use specific image id
    const response = await axios.get(`${CORE_BE_API_URL}/images/${imageId}`);
    const { data } = response;
    return data.images;
  }
};

export const fetchListOfSpecies = async () => {
  const response = await axios.get(`${CORE_BE_API_URL}/species`);
  const { data } = response;
  const listOfSpecies = data.species;
  const filteredListOfSpecies = listOfSpecies.filter(
    (species: speciesObj) => species.species !== "No Cv Result"
  );

  const speciesWithImages = filteredListOfSpecies.map((species: speciesObj) => {
    return {
      ...species,
      image: birdAvatars[species.species],
    };
  });
  return speciesWithImages;
};
