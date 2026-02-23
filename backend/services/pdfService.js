import PDFDocument from "pdfkit";
import fs from "fs";
import { CBS_IBS_CST_MAP, CLASS_TRIB_MAP }
from "../shared/reformaTributariaMap.js";

/* ===============================
   FORMATADORES
=============================== */

function formatPercent(value) {
  if (!value && value !== 0) return "-";
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  return `${num.toLocaleString("pt-BR")} %`;
}

function safe(value) {
  if (value === null || value === undefined || value === "") return "-";
  return value;
}

/* ===============================
   DICIONÁRIOS
=============================== */

const CST_MAP = {
  "00": "00 - Tributada integralmente",
  "10": "10 - Tributada com ST",
  "20": "20 - Com redução de base",
  "30": "30 - Isenta com ST",
  "40": "40 - Isenta",
  "41": "41 - Não tributada",
  "50": "50 - Suspensão",
  "51": "51 - Diferimento",
  "60": "60 - ICMS ST anterior",
  "90": "90 - Outras",
};

const CSOSN_MAP = {

  "02": "02 - Simples Nacional - Tributada pelo Simples Nacional com permissão de crédito",
  "15": "15 - Tributação monofásica própria e com responsabilidade pela retenção sobre combustíveis",
  "53": "53 - Tributação monofásica sobre combustíveis com recolhimento diferido",
  "61": "61 - Tributação monofásica sobre combustíveis cobrada anteriormente",
  "101": "101 - Simples Nacional - Tributada pelo Simples Nacional com permissão de crédito",
  "102": "102 - Simples Nacional - Tributada pelo Simples Nacional sem permissão de crédito",
  "103": "103 - Simples Nacional - Isenção do ICMS no Simples Nacional para faixa de receita bruta",
  "300": "300 - Simples Nacional - Imune",
  "400": "400 - Simples Nacional - Não tributada pelo Simples Nacional",
  "500": "500 - Simples Nacional - ICMS cobrado anteriormente por substituição tributária (substituído) ou por antecipação",
  "900": "900 - Simples Nacional - Outros",
};

const PIS_COFINS_MAP = {
  "01": "01 - Operação Tributável (alíquota básica)",
  "02": "02 - Operação Tributável (alíquota diferenciada)",
  "03": "03 - Operação Tributável (alíquota por unidade)",
  "04": "04 - Monofásica",
  "05": "05 - Substituição Tributária",
  "06": "06 - Alíquota Zero",
  "07": "07 - Isenta",
  "08": "08 - Sem Incidência",
  "09": "09 - Suspensão",
  "49": "49 - Outras Operações",
  "99": "99 - Outras Operações",
};

/* ===============================
   GERAR PDF
=============================== */

export function gerarPDF(payload) {
  return new Promise((resolve) => {

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("pageAdded", () => {
  doc.rect(0, 0, doc.page.width, doc.page.height)
     .fill("#f4f5f9");
  doc.fillColor("#111");
});
    doc.rect(0, 0, doc.page.width, doc.page.height)
   .fill("#f4f5f9");

doc.fillColor("#111");
    const margin = doc.page.margins.left;
    const contentWidth = doc.page.width - margin * 2;

    /* ===============================
       HEADER
    =============================== */

    const logoPath = "./assets/logo.jpg";

    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, margin, 40, { width: 120 });
    }

    doc
      doc
  .fontSize(20)
  .fillColor("#6c43d0")
  .text("Parametrização Fiscal", margin + 140, 50);

doc
  .fontSize(10)
  .fillColor("#666")
  .text("SupraTech Sistemas", margin + 140, 72);

    doc.moveDown(3);

    /* ===============================
       HELPERS VISUAIS
    =============================== */

   const section = (title) => {
  doc
    .fillColor("#6c43d0")
    .fontSize(14)
    .text(title);
  doc.moveDown();
};


  const item = (label, value) => {
  doc
    .fontSize(10)
    .fillColor("#777")
    .text(label, { continued: true });

  doc
    .fillColor("#111")
    .text(` ${safe(value)}`);
};

 const card = (title, drawContent) => {
  const startY = doc.y;

  const boxPadding = 12;
  const boxWidth = contentWidth;
  
  doc.moveDown();

  const boxTop = doc.y;

  // Fundo do card
  doc
    .rect(margin, boxTop, boxWidth, 20)
    .fill("#ffffff");

  doc
    .strokeColor("#e2e2e2")
    .lineWidth(1)
    .rect(margin, boxTop, boxWidth, 1)
    .stroke();

  // Título
  doc
    .fillColor("#6c43d0")
    .fontSize(13)
    .text(title, margin + boxPadding, boxTop + 5);

  doc.moveDown(1.5);
  doc.fillColor("#111");

  drawContent();

  doc.moveDown(1);
};
    /* ===============================
       CONTABILIDADE
    =============================== */

    card("Contabilidade", () => {
      item("Nome:", payload.contabilidade.nome);
      item("Telefone:", payload.contabilidade.telefone);
    });

    doc.moveDown();
doc
  .strokeColor("#e0e0e0")
  .lineWidth(1)
  .moveTo(margin, doc.y)
  .lineTo(doc.page.width - margin, doc.y)
  .stroke();
doc.moveDown();

    /* ===============================
       EMPRESA
    =============================== */

    card("Empresa", () => {
      item("Razão Social:", payload.empresa.razaoSocial);
      item("CNPJ/CPF:", payload.empresa.cnpj);
      item("Inscrição Estadual:", payload.empresa.ie);
      item("CRT:", payload.empresa.crt);
    });

doc.moveDown();
doc
  .strokeColor("#e0e0e0")
  .lineWidth(1)
  .moveTo(margin, doc.y)
  .lineTo(doc.page.width - margin, doc.y)
  .stroke();
doc.moveDown();

    /* ===============================
       DOCUMENTOS
    =============================== */

    card("Documentos Emitidos", () => {
      item("Selecionados:", payload.documentos?.selecionados?.join(", ") || "-");
     item(
  "NF-e e NFC-e mesmos dados:",
  payload.documentos?.nfeNfceMesmosDados ? "Sim" : "Não"
);

    });

    doc.moveDown();
doc
  .strokeColor("#e0e0e0")
  .lineWidth(1)
  .moveTo(margin, doc.y)
  .lineTo(doc.page.width - margin, doc.y)
  .stroke();
doc.moveDown();

    /* ===============================
       CONFIGURAÇÃO POR DOCUMENTO
    =============================== */

section("Configuração por Documento");

if (!payload.configPorDocumento) {
  doc.end();
  return resolve(Buffer.concat(buffers));
}


Object.entries(payload.configPorDocumento).forEach(([docKey, cfg]) => {
doc.addPage();

  card(`Documento: ${docKey}`, () => {

    if (cfg.ambiente) item("Ambiente:", cfg.ambiente);
    if (cfg.serie) item("Série:", cfg.serie);
    if (cfg.ultimoNumero) item("Último Número:", cfg.ultimoNumero);

    // ==========================
    // ICMS
    // ==========================
    if (cfg.icms) {
      doc.moveDown().fillColor("#6c43d0").text("ICMS");
      item("Tipo:", cfg.icms.tipo);
item("Origem:", cfg.icms.origem);
      item(
        "Código:",
        cfg.icms.tipo === "CSOSN"
          ? CSOSN_MAP[cfg.icms.codigo] || cfg.icms.codigo
          : CST_MAP[cfg.icms.codigo] || cfg.icms.codigo
      );
      item("CFOP:", cfg.icms.cfop);
      item("Alíquota:", formatPercent(cfg.icms.aliquota));
    }

    // ==========================
    // PIS / COFINS
    // ==========================
    if (cfg.pisCofins) {
      doc.moveDown().fillColor("#6c43d0").text("PIS / COFINS");
      item("PIS:", PIS_COFINS_MAP[cfg.pisCofins.pisSituacao]);
      item("Alíquota PIS:", formatPercent(cfg.pisCofins.pisAliquota));
      item("COFINS:", PIS_COFINS_MAP[cfg.pisCofins.cofinsSituacao]);
      item("Alíquota COFINS:", formatPercent(cfg.pisCofins.cofinsAliquota));
    }

    // ==========================
    // NFCe
    // ==========================
    if (docKey === "NFCe") {
      if (cfg.nfceCsc) item("CSC:", cfg.nfceCsc);
      if (cfg.nfceToken) item("Token CSC:", cfg.nfceToken);
    }

    // ==========================
    // NFSe
    // ==========================
    if (cfg.nfse) {
      doc.moveDown().fillColor("#6c43d0").text("NFS-e");
      Object.entries(cfg.nfse).forEach(([k, v]) => {
        if (v) item(k, v);
      });
    }

    // ==========================
    // CTe
    // ==========================
    if (cfg.cte) {
      doc.moveDown().fillColor("#6c43d0").text("CT-e");
      Object.entries(cfg.cte).forEach(([k, v]) => {
        if (v) item(k, v);
      });
    }

    // ==========================
    // MDFe
    // ==========================
    if (cfg.mdfe) {
      doc.moveDown().fillColor("#6c43d0").text("MDF-e");
      Object.entries(cfg.mdfe).forEach(([k, v]) => {
        if (v) item(k, v);
      });
    }

    // ==========================
    // EFD
    // ==========================
    if (cfg.efd) {
      doc.moveDown().fillColor("#6c43d0").text("EFD Contribuições");
      item("Origem ICMS:", cfg.efd.origem);
     Object.entries(cfg.efd).forEach(([k, v]) => {
 if (k === "origem") return;
  if (typeof v === "object") {

    doc.moveDown().fillColor("#444").text(k.toUpperCase());

    Object.entries(v).forEach(([ik, iv]) => {

      let finalValue = iv;

      if (ik === "cstSaida" || ik === "cstEntrada") {
        finalValue = CST_MAP[iv] || iv;
      }

      item(`- ${ik}:`, finalValue);

    });

  } else if (v) {
    item(k, v);
  }

});

    }

    if (cfg.obs) {
      doc.moveDown();
      doc.fillColor("#6c43d0").text("Observações:");
      doc.fillColor("#111").text(cfg.obs);
    }

  

  });

});

    /* ===============================
       REFORMA TRIBUTÁRIA
    =============================== */

    if (payload.reformaTributaria?.habilitar && payload.reformaTributaria?.porDocumento) {

      section("Reforma Tributária (CBS / IBS)");

      Object.entries(payload.reformaTributaria.porDocumento)
        .forEach(([docKey, rt]) => {

  card(`Reforma - ${docKey}`, () => {

  if (rt.municipio) {

    item("Município:", rt.municipio);
    item("Alíquota IBS:", formatPercent(rt.ibs));
    item("Diferimento IBS:", formatPercent(rt.diferimento));
    item("Redução IBS:", formatPercent(rt.reducao));

  } else {

    item("CST CBS/IBS:", CBS_IBS_CST_MAP[rt.cst] || rt.cst);
    item("Classificação Tributária:", CLASS_TRIB_MAP[rt.classTrib] || rt.classTrib);
    item("Alíquota CBS:", formatPercent(rt.cbs));
    item("Alíquota IBS:", formatPercent(rt.ibs));
    item("Deduz ICMS:", rt.deduzIcms === "sim" ? "Sim" : "Não");

    if (rt.credito) {
      item("Crédito Presumido:", rt.credito);
      item("% Crédito CBS:", formatPercent(rt.percCreditoCBS));
      item("% Crédito IBS:", formatPercent(rt.percCreditoIBS));
    }

  }

});


        });
    }

    doc.end();
  });
}
