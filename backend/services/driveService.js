import { google } from "googleapis";
import { Readable } from "stream";

function getAuth() {
  const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;

  if (!credentialsJson) {
    throw new Error("GOOGLE_CREDENTIALS_JSON não definido");
  }

  const credentials = JSON.parse(credentialsJson);

  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
}

async function getDrive() {
  const auth = getAuth();
  return google.drive({ version: "v3", auth });
}

async function findFolderByName({ drive, name, parentId }) {
  const query = [
    "mimeType='application/vnd.google-apps.folder'",
    `name='${name.replace(/'/g, "\\'")}'`,
    "trashed=false",
  ];

  if (parentId) {
    query.push(`'${parentId}' in parents`);
  }

 const res = await drive.files.list({
  supportsAllDrives: true,
  includeItemsFromAllDrives: true,
  q: query.join(" and "),
  fields: "files(id, name)",
});


  return res.data.files?.[0] || null;
}

async function ensureFolder({ drive, name, parentId }) {
  const existing = await findFolderByName({ drive, name, parentId });

  if (existing) {
    return existing.id;
  }

const created = await drive.files.create({
  supportsAllDrives: true,
  requestBody: {
    name,
    mimeType: "application/vnd.google-apps.folder",
    parents: parentId ? [parentId] : undefined,
  },
  fields: "id",
});


  return created.data.id;
}

async function uploadBuffer({ drive, folderId, filename, mimeType, buffer }) {
  const stream = Readable.from(buffer);

  const created = await drive.files.create({
  supportsAllDrives: true,
  requestBody: {
    name: filename,
    parents: [folderId],
  },
  media: {
    mimeType,
    body: stream,
  },
  fields: "id",
});


  return created.data;
}

function sanitizeFolderName(value) {
  return String(value || "")
    .replace(/[\\\/:*?"<>|]/g, "-")
    .trim();
}

function buildClientFolderName(payload) {
  const cnpj = payload?.empresa?.cnpj || "SEM-CNPJ";
  const razao = payload?.empresa?.razaoSocial || "SEM-NOME";

  return sanitizeFolderName(`${cnpj} - ${razao}`);
}

// ✅ EXPORT PRINCIPAL
export async function salvarSubmissaoNoDrive({
  payload,
  pdfBuffer,
  certFile,
}) {
  const drive = await getDrive();

const rootId = "1W3uh2L7U5FIpdlwYXJrML_BiFm9ZDNCM";
  
if (!rootId) {
  throw new Error("DRIVE_ROOT_FOLDER_ID não definido no .env");
}


  const selectedDocs = payload?.documentos?.selecionados || [];
  const clientFolderName = buildClientFolderName(payload);

  const date = new Date().toISOString().slice(0, 10);
  const pdfName = `${date} - parametrizacao-fiscal.pdf`;

  for (const doc of selectedDocs) {
    // cria pasta do documento
    const docFolderId = await ensureFolder({
      drive,
      name: doc,
      parentId: rootId,
    });

    // cria pasta do cliente dentro do documento
    const clientFolderId = await ensureFolder({
      drive,
      name: clientFolderName,
      parentId: docFolderId,
    });

    // envia PDF
    await uploadBuffer({
      drive,
      folderId: clientFolderId,
      filename: pdfName,
      mimeType: "application/pdf",
      buffer: pdfBuffer,
    });

    // envia certificado se existir
    if (certFile) {
      await uploadBuffer({
        drive,
        folderId: clientFolderId,
        filename: certFile.originalname,
        mimeType: certFile.mimetype || "application/octet-stream",
        buffer: certFile.buffer,
      });
    }
  }

  return { ok: true };
}
