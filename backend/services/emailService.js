import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";
import { supportEmails } from "../config/supportEmails.js";

// 🔒 Validação básica de ambiente
const requiredEnv = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS"
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Variável de ambiente ausente: ${key}`);
  }
});

export async function enviarEmailComAnexo({
  subject,
  text,
  attachments = [],
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME || "Sistema"}" <${process.env.SMTP_USER}>`,
      to: supportEmails.join(","), // múltiplos destinatários
      subject,
      text,
      attachments,
    });

    console.log("📧 E-mail enviado com sucesso");
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error.message);
    throw error; // deixa o controller decidir o que fazer
  }
}

