let is_local = false;

export const CORE_BE_API_URL = is_local
  ? "http://localhost:8080"
  : "https://chirpchirp-core-api-260006186791.us-east4.run.app";

export const EMAIL_SERVICE_API_URL =
  "https://chirp-chirp-email-service-260006186791.us-east4.run.app";
