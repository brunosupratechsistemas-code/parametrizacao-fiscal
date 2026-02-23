import fs from "fs";
import path from "path";

function sanitizeName(value) {
  return String(value || "")
    .replace(/[\\\/:*?"<>|]/g, "-")
    .trim();
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export async function salvarLocalmente({
  payload,
  pdfBuffer,
  certFile,
}) {
  const baseDir = "G:/Meu Drive/PARAMETRIZAÇÕES CLIENTES";

  const selectedDocs = payload?.documentos?.selecionados || [];

  const cnpj = payload?.empresa?.cnpj || "SEM-CNPJ";
  const razao = payload?.empresa?.razaoSocial || "SEM-NOME";

  const clientFolder = sanitizeName(`${cnpj} - ${razao}`);

  const date = new Date().toISOString().slice(0, 10);
  const pdfName = `${date} - parametrizacao-fiscal.pdf`;

  for (const doc of selectedDocs) {
    const docPath = path.join(baseDir, doc, clientFolder);

    ensureDir(docPath);

    // salva PDF
    fs.writeFileSync(path.join(docPath, pdfName), pdfBuffer);

    // salva certificado se existir
    if (certFile) {
      fs.writeFileSync(
        path.join(docPath, certFile.originalname),
        certFile.buffer
      );
    }

    // salva também o JSON do payload (extra profissional)
    fs.writeFileSync(
      path.join(docPath, `${date} - payload.json`),
      JSON.stringify(payload, null, 2)
    );
  }

  return { ok: true };
}
