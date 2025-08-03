import { SanityDocument } from "next-sanity";

export type AudioTrack = SanityDocument & {
  songName: string;
  artistName: string;
  audioUrl: string;
};
