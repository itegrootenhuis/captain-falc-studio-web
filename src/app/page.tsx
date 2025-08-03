import Image from "next/image";
import { urlFor } from "@/sanity/imageUrl";
import { PortableText } from "@portabletext/react";
import ContactForm from "@/components/ContactForm";
import { Icon } from "@iconify/react";
import instagramIcon from "@iconify-icons/mdi/instagram";
import ScrollToContactButton from "@/components/ScrollToContactButton";
import { AudioTrack } from "@/types/audio";
import AudioPlayer from "@/components/AudioPlayer";

import { type SanityDocument } from "next-sanity";

import { client } from "@/sanity/client";

const LANDING_PAGE_QUERY = `
  *[_type == "landingPage"][0]{
    _id,
    headline,
    subheadline,
    backgroundImage,
  }
`;

const AUDIO_QUERY = `
 *[_type == "audio"] | order(sortOrder asc) {
    _id,
    songName,
    artistName,
    "audioUrl": audioFile.asset->url
  }
`;

const BIO_PAGE_QUERY = `
  *[_type == "bioPage"][0]{
    _id,
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
    contactFromTitle,
    contactFromSubTitle,
  }
`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const landingPage = await client.fetch<SanityDocument>(
    LANDING_PAGE_QUERY,
    {},
    options
  );

  const audioFiles = await client.fetch<AudioTrack[]>(AUDIO_QUERY, {}, options);

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
    <main className="min-h-screen">
      <section
        className={`h-screen mb-20 md:mb-8 pb-8 ${!landingPage.backgroundImage}`}
        style={
          landingPage.backgroundImage
            ? {
                backgroundImage: `url(${urlFor(landingPage.backgroundImage).url()})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="container mx-auto relative z-10">
          <div className="heading pt-[60px]">
            <h1 className="text-6xl md:text-9xl tracking-wider font-bold font-header mb-4 text-center text-shadow-hard">
              {landingPage.headline}
            </h1>
            <h2 className="text-2xl md:text-4xl tracking-wide font-bold font-header mb-2 text-center text-shadow-hard">
              {landingPage.subheadline}
            </h2>
            <div className="socials mb-4">
              <a
                href={globalSettings.instagramUrl}
                className="mx-auto block w-[50px] group"
                target="_blank"
              >
                <div className="p-2 rounded-full transition-all duration-200 group-hover:bg-white group-hover:box-shadow-hard">
                  <Icon
                    icon={instagramIcon}
                    className="text-white w-9 h-9 transition-colors duration-200 group-hover:text-black"
                  />
                </div>
              </a>
            </div>
          </div>
          <div className="audio-list mx-auto px-4">
            <AudioPlayer audioFiles={audioFiles} />
          </div>
          <ScrollToContactButton />
        </div>
      </section>

      <section className="container mx-auto py-20 md:py-40">
        <div className="mx-auto px-4 grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8 items-center relative">
          <div className="z-0">
            <Image
              src={urlFor(bioPage.bioImage).width(600).height(600).url()}
              alt={bioPage.bioImageAlt}
              width={600}
              height={600}
              className="h-auto rounded-lg shadow-lg linear-fade-edges"
            />
          </div>
          <div className="text-justify space-y-6 md:-ml-20 z-10 relative">
            <div className="text-2xl md:text-4xl text-white space-y-4">
              <PortableText value={bioPage.bioContent} />
            </div>
          </div>
        </div>
      </section>

      <section id="contact-form" className="h-screen">
        <div className="mx-auto px-4 container mt-20">
          <h2 className="text-5xl font-bold mb-6 text-center">
            {contactPage.contactFromTitle}
          </h2>
          <p className="text-xl font-bold mb-6 text-center">
            {contactPage.contactFromSubTitle}
          </p>
          <ContactForm />
        </div>
        <div className="socials mt-4">
          <a
            href={globalSettings.instagramUrl}
            className="mx-auto block w-[50px] group"
            target="_blank"
          >
            <div className="p-2 rounded-full transition-all duration-200 group-hover:bg-white group-hover:box-shadow-hard">
              <Icon
                icon={instagramIcon}
                className="text-white w-9 h-9 transition-colors duration-200 group-hover:text-black"
              />
            </div>
          </a>
        </div>
      </section>
    </main>
  );
}
