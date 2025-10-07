import type { NextApiRequest, NextApiResponse } from "next";
import { sendToSupport } from "./_send";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  
  try {
    const { company, name, email, note } = req.body ?? {};
    await sendToSupport(
      `[Partner Application] ${company || "Unknown company"}`,
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\n${note || ""}`
    );
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Partner apply error:", error);
    res.status(500).json({ ok: false, error: "Failed to send application" });
  }
}

