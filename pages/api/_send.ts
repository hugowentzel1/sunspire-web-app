import nodemailer from "nodemailer";

export async function sendToSupport(subject: string, text: string) {
  const url = process.env.SMTP_URL;
  if (!url) {
    console.warn("Missing SMTP_URL - email not sent");
    throw new Error("Missing SMTP_URL");
  }
  const transporter = nodemailer.createTransport(url);
  await transporter.sendMail({
    to: "support@getsunspire.com",
    from: "no-reply@getsunspire.com",
    subject,
    text,
  });
}

