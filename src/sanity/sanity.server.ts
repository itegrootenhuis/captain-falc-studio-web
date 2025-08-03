// /lib/sanity.server.ts
import { createClient } from "next-sanity";

export const sanityServerClient = createClient({
  projectId: "tes1c0mg",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN, // Add this to your .env.local
  useCdn: false,
});
