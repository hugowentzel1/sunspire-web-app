import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  
  try {
    const { company, name, email, phone, clientRange, message } = req.body || {};
    if (!company || !name || !email) return res.status(400).json({ ok: false, error: "Missing required fields" });

    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const html = `
      <h2>New Partner Application</h2>
      <p><b>Company:</b> ${company}</p>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone || "—"}</p>
      <p><b>Client Range:</b> ${clientRange || "—"}</p>
      <p><b>Message:</b><br/>${(message || "").replace(/\n/g, "<br/>")}</p>
    `;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: "support@getsunspire.com",
      subject: `[Partner Application] ${company} — ${name}`,
      html,
    });

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "Email send failed" });
  }
}
