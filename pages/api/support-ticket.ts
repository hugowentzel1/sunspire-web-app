import type { NextApiRequest, NextApiResponse } from "next";
import { sendToSupport } from "./_send";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  
  try {
    const { subject, email, message, priority } = req.body ?? {};
    await sendToSupport(
      `[Support] ${subject || "No subject"} (${priority || "normal"})`,
      `From: ${email}\nPriority: ${priority}\n\n${message || ""}`
    );
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Support ticket error:", error);
    res.status(500).json({ ok: false, error: "Failed to send support ticket" });
  }
}

