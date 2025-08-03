import { sanityServerClient } from "@/sanity/sanity.server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, message, token } = body;

  if (!name || !email || !message || !token) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Verify reCAPTCHA
  const recaptchaRes = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    }
  );

  const recaptchaData = await recaptchaRes.json();

  if (!recaptchaData.success) {
    console.warn("Failed reCAPTCHA:", recaptchaData);
    return NextResponse.json({ error: "Failed CAPTCHA" }, { status: 400 });
  }

  try {
    const result = await sanityServerClient.create({
      _type: "contactFromSubmission",
      name,
      email,
      message,
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Submission saved", id: result._id });
  } catch (err) {
    console.error("Error saving to Sanity:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
