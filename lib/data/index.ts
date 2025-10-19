"use server";

import axios from "axios";
import { birdAvatars } from "../birdAvatars";
import { CORE_BE_API_URL } from "../constants";

export const fetchImagesWithAttribution = async (imageId = "") => {
  // if no image id passed, fetch all images
  if (!imageId) {
    const totalImages = [];

    const response = await axios.get(`${CORE_BE_API_URL}/images?limit=100`);
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
  console.log("the data", data);
  const listOfSpecies = data.species;
  const filteredListOfSpecies = listOfSpecies.filter(
    (species) => species.species !== "No Cv Result"
  );

  const speciesWithImages = filteredListOfSpecies.map((species) => {
    return {
      ...species,
      image: birdAvatars[species.species],
    };
  });
  return speciesWithImages;
};
