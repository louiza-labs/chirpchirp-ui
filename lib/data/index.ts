"use server";
import axios from "axios";
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
