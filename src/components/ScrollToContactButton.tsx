"use client";

export default function ScrollToContactButton() {
  const scrollToContact = () => {
    const contactEl = document.getElementById("contact-form");
    contactEl?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToContact}
      className="mt-6 px-8 py-4 text-4xl bg-black text-white mx-auto block rounded hover:bg-white hover:text-black transition box-shadow-hard"
    >
      Contact Me
    </button>
  );
}
