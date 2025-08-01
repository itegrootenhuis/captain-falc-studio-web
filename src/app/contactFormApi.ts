import { NextApiRequest, NextApiResponse } from "next";
import { client } from "@/sanity/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, message } = req.body;

  try {
    await client.create({
      _type: "contactMessage",
      name,
      email,
      message,
    });

    return res.status(200).json({ message: "Message received" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
