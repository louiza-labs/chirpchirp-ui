export interface Attribution {
  species: string;
  confidence: number;
  model_version: string;
}

export interface MainGalleryCardProps {
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

export interface speciesObj {
  species: string;
  id: string;
  image: string;
  count: number;
}
