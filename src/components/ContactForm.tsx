"use client";
import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const token = await recaptchaRef.current?.executeAsync();
      recaptchaRef.current?.reset();

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, token }),
      });

      if (res.ok) {
        setStatus("Message sent!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error sending message.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl mx-auto w-full px-4 py-10"
    >
      <input
        type="text"
        name="name"
        placeholder="Name or Band Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full p-4 border border-white/50 rounded-md bg-black text-white text-lg"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full p-4 border border-white/50 rounded-md bg-black text-white text-lg"
      />
      <textarea
        name="message"
        placeholder="Message"
        value={formData.message}
        onChange={handleChange}
        required
        rows={6}
        className="w-full p-4 border border-white/50 rounded-md bg-black text-white text-lg"
      />
      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey="6LdGj5krAAAAAECMwR_kS23QeGH39uTZTSwiXHsN"
      />
      <button
        type="submit"
        className="bg-black text-white px-10 py-2 text-4xl rounded block mx-auto hover:bg-white hover:text-black hover:cursor-pointer transition"
      >
        Send
      </button>
      {status && (
        <p className="text-center text-white text-sm italic">{status}</p>
      )}
    </form>
  );
}
