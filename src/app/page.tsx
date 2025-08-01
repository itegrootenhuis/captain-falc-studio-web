import Image from "next/image";
import { urlFor } from "@/sanity/imageUrl";
import { PortableText } from "@portabletext/react";
import ContactForm from "@/components/ContactForm";
import { Icon } from "@iconify/react";
import instagramIcon from "@iconify-icons/mdi/instagram";

import { type SanityDocument } from "next-sanity";

import { client } from "@/sanity/client";

const LANDING_PAGE_QUERY = `
  *[_type == "landingPage"][0]{
    _id,
    headline,
    subheadline,
    backgroundImage,
    backgroundColor
  }
`;

const AUDIO_QUERY = `
 *[_type == "audio"]{
    _id,
    songName,
    artistName,
    "audioUrl": audioFile.asset->url
  }
`;

const BIO_PAGE_QUERY = `
  *[_type == "bioPage"][0]{
    _id,
    backgroundColor,
    bioContent,
    bioImage,
    bioImageAlt,
  }
`;

const GLOBAL_SETTINGS_QUERY = `
  *[_type == "globalSettings"][0]{
    favicon,
    websiteTitle,
    instagramUrl,
  }
`;

const CONTACT_PAGE_QUERY = `
  *[_type == "contactPage"][0]{
    _id,
    backgroundColor,
  }
`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const landingPage = await client.fetch<SanityDocument>(
    LANDING_PAGE_QUERY,
    {},
    options
  );

  const audioFiles = await client.fetch<SanityDocument[]>(
    AUDIO_QUERY,
    {},
    options
  );

  const bioPage = await client.fetch<SanityDocument>(
    BIO_PAGE_QUERY,
    {},
    options
  );

  const contactPage = await client.fetch<SanityDocument>(
    CONTACT_PAGE_QUERY,
    {},
    options
  );

  const globalSettings = await client.fetch<SanityDocument>(
    GLOBAL_SETTINGS_QUERY,
    {},
    options
  );

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <section className="landing-page mb-8">
        <div className="heading">
          <h1 className="text-6xl font-bold mb-4 text-center">
            {landingPage.headline}
          </h1>
          <h2 className="text-2xl font-bold mb-8 text-center">
            {landingPage.subheadline}
          </h2>
          <div className="socials mb-4">
            <a href={globalSettings.instagramUrl}>
              <Icon
                icon={instagramIcon}
                className="text-white-600 mx-auto"
                width="36"
                height="36"
              />
            </a>
          </div>
        </div>
        <div className="audio-list container mx-auto px-4">
          <div className="grid gap-6">
            {audioFiles.map((track) => (
              <div key={track._id} className="border rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold">{track.songName}</h3>
                <p className="text-gray-600 mb-4">{track.artistName}</p>
                <audio controls className="w-full">
                  <source src={track.audioUrl} type="audio/flac" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bio-page py-16 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-left space-y-6">
            <div className="text-lg text-gray-700 space-y-4">
              <PortableText value={bioPage.bioContent} />
            </div>
          </div>
          <div className="w-full">
            <Image
              src={urlFor(bioPage.bioImage).width(600).height(800).url()}
              alt={bioPage.bioImageAlt}
              width={600} // required
              height={800} // required
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="contact-page py-16 bg-gray-100">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Get in Touch</h2>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
