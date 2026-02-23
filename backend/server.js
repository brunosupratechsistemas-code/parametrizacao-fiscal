import express from "express";
import multer from "multer";
import cors from "cors";
import { gerarPDF } from "./services/pdfService.js";
import { enviarEmailComAnexo } from "./services/emailService.js";
import dotenv from "dotenv";
dotenv.config();
import { salvarSubmissaoNoDrive } from "./services/driveService.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());

app.post("/api/submit", upload.single("certificado"), async (req, res) => {
  try {
    const payload = JSON.parse(req.body.payload);

    // Responde imediatamente
    res.json({ ok: true });

    // Processa em background
    const pdfBuffer = await gerarPDF(payload);

await salvarSubmissaoNoDrive({
  payload,
  pdfBuffer,
  certFile: req.file || null,
});
    const attachments = [
      { filename: "parametrizacao-fiscal.pdf", content: pdfBuffer },
    ];

    if (req.file) {
      attachments.push({
        filename: req.file.originalname,
        content: req.file.buffer,
        contentType: req.file.mimetype,
      });
    }

    await enviarEmailComAnexo({
      subject: "Parametrização Fiscal - SupraTech",
      text: "Segue em anexo a parametrização fiscal preenchida.",
      attachments,
    });

  } catch (err) {
    console.error(err);
  }
});


const PORT = process.env.PORT || 3333;

app.listen(PORT, () =>
  console.log(`🚀 API rodando em http://localhost:${PORT}`)
);