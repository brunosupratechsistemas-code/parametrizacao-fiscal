const API_URL = "https://SEU-BACKEND.onrender.com/api/submit";
import { CBS_IBS_CST_MAP, CLASS_TRIB_MAP, RT_MAP } 
from "./backend/shared/reformaTributariaMap.js";

let step = 0;
const totalSteps = 6;

const formWizard = document.getElementById("formWizard");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const stepsBtns = document.querySelectorAll(".step");
const panels = document.querySelectorAll(".panel");
const previewEl = document.getElementById("preview");
const statusEl = document.getElementById("status");
const docTabsEl = document.getElementById("docTabs");
const docTabContentEl = document.getElementById("docTabContent");
const tplDocBase = document.getElementById("tplDocBase");
const certInput = document.getElementById('emp_cert');
const certLabel = document.getElementById('certLabel');
function getValue(selector) {
  const el = document.querySelector(selector);
  return el ? el.value : "";
}



if (certInput) {
  certInput.addEventListener('change', () => {
    if (certInput.files.length > 0) {
      certLabel.textContent = `📎 ${certInput.files[0].name}`;
    } else {
      certLabel.textContent = '📎 Selecionar certificado digital (.pfx)';
    }
  });
}

// Empresa/CRT
const empCrt = document.getElementById("emp_crt");

// Documentos
const docChecks = document.querySelectorAll(".docCheck");
const boxNfeNfce = document.getElementById("box_nfe_nfce");
const nfeNfceMesmo = document.getElementById("nfe_nfce_mesmo");

// Config por documento

// Reforma Tributária
const rtHabilitar = document.getElementById("rt_habilitar");
const rtBox = document.getElementById("rt_box");
// Configuração por documento (padrão/manual)
const docLabels = {
  NFe: "NF-e",
  NFCe: "NFC-e",
  NFSe: "NFS-e",
  CTe: "CT-e",
  CTeOS: "CT-e OS",
  MDFe: "MDF-e",
  NFeEFD: "NF-e Regime Normal (EFD Contribuições)"
};
document.getElementById("emp_ie").addEventListener("input", e => {
  e.target.value = e.target.value.replace(/\D/g, "");
});



function controlarNFeEFDPorCRT() {
  const crt = empCrt.value;
  const chk = document.querySelector('.docCheck[value="NFeEFD"]');

  if (!chk) return;

  const permitido =
    crt === "Lucro Real" || crt === "Lucro Presumido";

  chk.disabled = !permitido;

  if (!permitido) {
    chk.checked = false;
    refreshDocs(); // remove a aba se estiver aberta
  }
}

function getListaICMSPorCRT() {
  const tipo = getTipoImpostoPorCRT(); // você já tem isso
  if (!tipo) return { tipo: null, lista: [] };
  const lista = (tipo === "CST") ? CST_LIST : CSOSN_LIST;
  return { tipo, lista };
}

// Utils
function showStep(n) {
  step = Math.max(0, Math.min(totalSteps - 1, n));

  panels.forEach(p => p.classList.remove("show"));
  document.querySelector(`.panel[data-panel="${step}"]`).classList.add("show");

  stepsBtns.forEach(b => b.classList.remove("active"));
  document.querySelector(`.step[data-step="${step}"]`).classList.add("active");

  btnPrev.disabled = step === 0;
  btnNext.style.display = step === totalSteps - 1 ? "none" : "inline-block";

  if (step === totalSteps - 1) {
    renderPreview();
  }
}

function nextStep() {
  showStep(step + 1);
}

stepsBtns.forEach(b => {
  b.addEventListener("click", () => showStep(Number(b.dataset.step)));
});
// ===============================
// ✅ Validações fiscais (antes de avançar no wizard)
// ===============================
function normalizeAliq(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = parseFloat(String(v).replace(",", "."));
  if (Number.isNaN(n)) return null;
  return n.toFixed(2); // "0.65", "1.65", "3.00", "7.60"
}

function validateFiscalDocPanelsBeforeNext() {
  // Valida todas as abas do passo "Configuração por documento"
  const panels = document.querySelectorAll(".docPanel");

  for (const panel of panels) {
    // pega campos
    const pisSit = panel.querySelector(".pisSituacao")?.value;
    const pisAliqEl = panel.querySelector(".pisAliquota");

    const cofSit = panel.querySelector(".cofinsSituacao")?.value;
    const cofAliqEl = panel.querySelector(".cofinsAliquota");

    const icmsCodigo = panel.querySelector(".icmsCodigo")?.value;
    const icmsAliqEl = panel.querySelector(".icmsAliquota");

    // ===============================
    // 1) ICMS CST 00 => alíquota obrigatória
    // ===============================
    if (icmsCodigo === "00") {
      const icmsAliq = normalizeAliq(icmsAliqEl?.value);
      if (!icmsAliq || parseFloat(icmsAliq) <= 0) {
        icmsAliqEl?.focus();
        showToast("⚠️ CST 00 exige alíquota de ICMS obrigatória.", "error");
        return false;
      }
    }

    // ===============================
    // 2) PIS situação 01 => só 0,65 ou 1,65 (PRIMEIRO!)
    // ===============================
    if (pisSit === "01") {
      const pisAliq = normalizeAliq(pisAliqEl?.value);
      if (!["0.65", "1.65"].includes(pisAliq)) {
        pisAliqEl?.focus();
        showToast("⚠️ PIS 01 só permite 0,65% ou 1,65%.", "error");
        return false; // <- para aqui (prioriza PIS)
      }
    }

    // ===============================
    // 3) COFINS situação 01 => só 3,00 ou 7,60 (só valida se PIS passou)
    // ===============================
    if (cofSit === "01") {
      const cofAliq = normalizeAliq(cofAliqEl?.value);
      if (!["3.00", "7.60"].includes(cofAliq)) {
        cofAliqEl?.focus();
        showToast("⚠️ COFINS 01 só permite 3,00% ou 7,60%.", "error");
        return false;
      }
    }
  }

  return true; // tudo ok
}



btnPrev.addEventListener("click", () => showStep(step - 1));
btnNext.addEventListener("click", () => {

  if (step === 2) {
  const selecionados = Array.from(docChecks).filter(c => c.checked);

  if (selecionados.length === 0) {
    showToast("⚠️ Selecione pelo menos 1 documento.", "error");
    return;
  }
}

  const panel = document.querySelector(".panel.show");
  const required = panel.querySelectorAll("[required]");

  for (const field of required) {
    if (!field.value) {
      field.focus();
      showToast("⚠️ Preencha todos os campos obrigatórios antes de continuar.");
      return;
    }
  }

    if (step === 1) {
  const cert = document.getElementById('emp_cert');
  const senha = document.getElementById('emp_cert_senha');

  if (!cert.files.length) {
    showToast('Selecione o certificado digital (.pfx)', 'error');
    return;
  }

  if (!senha.value) {
    showToast('Informe a senha do certificado digital', 'error');
    return;
  }
}

  // 🔎 Validações fiscais antes de avançar (apenas no passo 3 - Configuração por documento)
  if (step === 3) {
    const ok = validateFiscalDocPanelsBeforeNext();
    if (!ok) return;
  }

if (step === 4 && rtHabilitar.checked) {

  const cst = document.getElementById("rt_cst");
  const classTrib = document.getElementById("rt_class");

  if (cst.offsetParent !== null && !cst.value) {
    showToast("⚠️ Selecione o CST CBS/IBS.");
    return;
  }

  if (classTrib.offsetParent !== null && !classTrib.value) {
    showToast("⚠️ Selecione a Classificação Tributária.");
    return;
  }
}
// 🔥 Valida ICMS obrigatório
let erroICMS = false;

document.querySelectorAll(".docPanel").forEach(panel => {
  const icms = panel.querySelector(".icmsCodigo");
  if (icms && !icms.value) {
    erroICMS = true;
  }
});

if (erroICMS) {
  showToast("⚠️ CST / CSOSN é obrigatório.", "error");
  return;
}


  nextStep();
});





function getTipoImpostoPorCRT() {
  const crt = empCrt.value;

  if (
    crt === "MEI" ||
    crt.startsWith("Simples Nacional")
  ) {
    return "CSOSN";
  }

  if (
    crt === "Lucro Real" ||
    crt === "Lucro Presumido"
  ) {
    return "CST";
  }

  return null;
}



empCrt.addEventListener("change", () => {
  hydrateICMSSelectsInsideTabs();
  controlarNFeEFDPorCRT();

  // só aplica se já existir painel
  if (document.querySelector(".docPanel")) {
    togglePadraoSimples();
  }
});


function controlarReformaPorCRT() {
  const crt = empCrt.value;
  const isLucro =
    crt === "Lucro Real" || crt === "Lucro Presumido";

  rtHabilitar.disabled = !isLucro;

  if (!isLucro) {
    rtHabilitar.checked = false;
    rtBox.style.display = "none";
  }
}

empCrt.addEventListener("change", controlarReformaPorCRT);
controlarReformaPorCRT();


function togglePadraoSimples() {
  const crt = empCrt.value;

  const isSimples =
    crt === "Simples Nacional" ||
    crt === "Simples Nacional - Excesso de sublimite da receita bruta" ||
    crt === "MEI";

  document.querySelectorAll(".docPanel").forEach(panel => {
    const box = panel.querySelector(".simplesPadrao");
    if (!box) return;

    box.style.display = isSimples ? "block" : "none";

    if (!isSimples) {
      box.querySelectorAll("input[type=radio]").forEach(r => r.checked = false);
    }
  });
}


// Documentos: mostrar opção nfe/nfce mesmos dados
function refreshDocs() {
  const selected = Array.from(docChecks).filter(c => c.checked).map(c => c.value);
  const hasNfe = selected.includes("NFe");
  const hasNfce = selected.includes("NFCe");

  boxNfeNfce.style.display = (hasNfe && hasNfce) ? "block" : "none";
  if (!(hasNfe && hasNfce)) nfeNfceMesmo.checked = false;

  // renderiza abas no passo "Configuração por documento"
  renderDocTabs(selected);
}


docChecks.forEach(c => 
  c.addEventListener("change", () => {
    refreshDocs();
    renderRTTabs();
  })
);


refreshDocs();
controlarNFeEFDPorCRT();





function renderDocTabs(selectedDocs) {
  docTabsEl.innerHTML = "";
  docTabContentEl.innerHTML = "";

  if (!selectedDocs.length) {
    docTabContentEl.innerHTML =
      `<div class="info">Selecione ao menos um documento no passo “Documentos”.</div>`;
    return;
  }

  selectedDocs.forEach((docKey, index) => {
    // ==== Cria a ABA ====
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "docTab" + (index === 0 ? " active" : "");
    tab.textContent = docLabels[docKey] || docKey;
    tab.dataset.doc = docKey;
    docTabsEl.appendChild(tab);

    // ==== Cria o CONTEÚDO ====
    const panel = document.createElement("div");
    panel.className = "docPanel" + (index === 0 ? " show" : "");
    panel.id = "panel_" + docKey;
panel.dataset.doc = docKey;
    // base comum
    const base = tplDocBase.content.cloneNode(true);
    base.querySelector(".docTitle").textContent = docLabels[docKey] || docKey;

    const body = base.querySelector(".docBody");

    // injeta template específico por documento
    if (docKey === "NFSe") {
      body.appendChild(document.getElementById("tplNFSe").content.cloneNode(true));
    }
    if (docKey === "NFe") {
  body.appendChild(document.getElementById("tplNFe").content.cloneNode(true));
}

if (docKey === "NFCe") {
  body.appendChild(document.getElementById("tplNFCe").content.cloneNode(true));
}

if (docKey === "NFeEFD") {
  body.appendChild(document.getElementById("tplNFeEFD").content.cloneNode(true));
  bindEfdPisCofinsAliquota(panel);
}

    if (docKey === "CTe" || docKey === "CTeOS") {
      body.appendChild(document.getElementById("tplCTe").content.cloneNode(true));
    }
    if (docKey === "MDFe") {
      body.appendChild(document.getElementById("tplMDFe").content.cloneNode(true));
    }

    // monta PIS/COFINS onde existir .pisCofinsMount
const mount = base.querySelector(".pisCofinsMount");
if (mount) {
  const tpl = document.getElementById("tplPisCofins");
  if (tpl) mount.appendChild(tpl.content.cloneNode(true));
}


    panel.appendChild(base);
    docTabContentEl.appendChild(panel);

    // click da aba
    tab.addEventListener("click", () => {
      document.querySelectorAll(".docTab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".docPanel").forEach(p => p.classList.remove("show"));

      tab.classList.add("active");
      panel.classList.add("show");
    });
  });

  // depois que renderiza, prepara selects ICMS dentro das abas NFe/NFCe
  hydrateICMSSelectsInsideTabs();
bindPisCofinsInsideTabs();
bindPadraoSimples();
initCustomSelects(docTabContentEl);

// 🔥 toggle só depois de tudo renderizado
setTimeout(() => {
  togglePadraoSimples();
}, 0);

}



// Reforma tributária toggle
rtHabilitar.addEventListener("change", () => {
  rtBox.style.display = rtHabilitar.checked ? "block" : "none";
  if (rtHabilitar.checked) {
    renderRTTabs();
  }
});

function collectConfigDocs() {
  const conf = {};
  const panels = docTabContentEl.querySelectorAll(".docPanel");

  panels.forEach(panel => {
    const doc = panel.dataset.doc;

    const card = panel.querySelector(".docCard");
if (!card) return;

    const ambiente = card.querySelector(".ambiente")?.value || null;
    const serie = card.querySelector(".serie")?.value || null;
    const ultimoNumero = card.querySelector(".ultimoNumero")?.value || null;

    conf[doc] = { ambiente, serie, ultimoNumero };

    // NFSe
    if (doc === "NFSe") {
      conf[doc].nfse = {
        inscricaoMunicipal: card.querySelector(".nfse-im")?.value || null,
        serieUltima: card.querySelector(".nfse-serie")?.value || null,
        numeroUltima: card.querySelector(".nfse-numero")?.value || null,
        aedf: card.querySelector(".nfse-aedf")?.value || null,
        aliquotaIss: card.querySelector(".nfse-iss")?.value || null,
        tipoTributacao: card.querySelector(".nfse-tipo-tributacao")?.value || null,
        exigibilidade: card.querySelector(".nfse-exigibilidade")?.value || null,
        listaServico: card.querySelector(".nfse-lista-servico")?.value || null,
        cnae: card.querySelector(".nfse-cnae")?.value || null,
        codTribMun: card.querySelector(".nfse-cod-trib-mun")?.value || null,
        obs: card.querySelector(".obs")?.value?.trim() || null,
        nbs: card.querySelector(".nfse-nbs")?.value || null,
        tribFed: card.querySelector(".nfse-trib-fed")?.value || null,
        tribEst: card.querySelector(".nfse-trib-est")?.value || null,
        tribMun: card.querySelector(".nfse-trib-mun")?.value || null,
        naturezaRps: card.querySelector(".nfse-natureza-rps")?.value || null,
        regimeEspecial: card.querySelector(".nfse-regime-especial")?.value || null,
        situacaoTrib: card.querySelector(".nfse-situacao-trib")?.value || null,
        municipioPadrao: card.querySelector(".nfse-municipio-padrao")?.value || null,
        regimeApuracao: card.querySelector(".nfse-regime-apuracao")?.value || null,
        loginPrefeitura: card.querySelector(".nfse-login-pref")?.value || null,
        senhaPrefeitura: card.querySelector(".nfse-senha-pref")?.value || null,

      };
    }

    if (doc === "NFeEFD") {
  conf[doc].efd = {
    serie: card.querySelector(".efd-serie")?.value || null,
    numero: card.querySelector(".efd-numero")?.value || null,
    origem: card.querySelector(".efd-origem")?.value || null,

    mascaraPlano: card.querySelector(".efd-mascara-plano")?.value || null,
    tipoPlano: card.querySelector(".efd-tipo-plano")?.value || null,

    atividade: card.querySelector(".efd-atividade")?.value || null,
    naturezaPJ: card.querySelector(".efd-natureza-pj")?.value || null,
    incidencia: card.querySelector(".efd-incidencia")?.value || null,
    metodoCreditos: card.querySelector(".efd-metodo-creditos")?.value || null,
    tipoContrib: card.querySelector(".efd-tipo-contrib")?.value || null,
    motivoSemMov: card.querySelector(".efd-motivo-sem-mov")?.value || null,

    receitaCofins: card.querySelector(".efd-receita-cofins")?.value || null,
    receitaPis: card.querySelector(".efd-receita-pis")?.value || null,

    icms: {
      codigo: card.querySelector(".icmsCodigo")?.value || null,
      aliquota: card.querySelector(".icmsAliquota")?.value || null,
      cfop: card.querySelector(".icmsCfop")?.value || null,
    },

    ipi: {
      cstSaida: card.querySelector(".ipi-cst-saida")?.value || null,
      aliquota: card.querySelector(".ipi-aliquota")?.value || null,
      classe: card.querySelector(".ipi-classe")?.value || null,
      selo: card.querySelector(".ipi-selo")?.value || null,
      qtdSelo: card.querySelector(".ipi-qtd-selo")?.value || null,
      codLegal: card.querySelector(".ipi-cod-legal")?.value || null,
      cstEntrada: card.querySelector(".ipi-cst-entrada")?.value || null,
    },

    pisCofinsEfd: {
      saida: card.querySelector(".efd-piscofins-saida")?.value || null,
      entrada: card.querySelector(".efd-piscofins-entrada")?.value || null,
      aliquota: card.querySelector(".efd-piscofins-aliquota")?.disabled
        ? null
        : (card.querySelector(".efd-piscofins-aliquota")?.value || null),
    },

    obs: card.querySelector(".obs")?.value?.trim() || null,

  };
}



    // NFe/NFCe
    if (doc === "NFe" || doc === "NFCe") {
      conf[doc].icms = {
  tipo: getTipoImpostoPorCRT(),
  origem: card.querySelector(".origem")?.value || null,
  codigo: card.querySelector(".icmsCodigo")?.value || null,
  cfop: card.querySelector(".icmsCfop")?.value || null,
  aliquota: card.querySelector(".icmsAliquota")?.value || null,
};


      conf[doc].pisCofins = {
        pisSituacao: card.querySelector(".pisSituacao")?.value || null,
        pisAliquota: card.querySelector(".pisAliquota")?.disabled ? null : (card.querySelector(".pisAliquota")?.value || null),
        cofinsSituacao: card.querySelector(".cofinsSituacao")?.value || null,
        cofinsAliquota: card.querySelector(".cofinsAliquota")?.disabled ? null : (card.querySelector(".cofinsAliquota")?.value || null),
      };
      conf[doc].obs = card.querySelector(".obs")?.value?.trim() || null;

    }

    if (doc === "NFCe") {
  conf[doc].nfceCsc = card.querySelector(".nfce-csc")?.value || null;
  conf[doc].nfceToken = card.querySelector(".nfce-token")?.value || null;
}


    // CTe / CTeOS
if (doc === "CTe" || doc === "CTeOS") {
  conf[doc].cte = {
    numero: card.querySelector(".cte-numero")?.value || null,
    serie: card.querySelector(".cte-serie")?.value || null,
    rntrc: card.querySelector(".cte-rntrc")?.value || null,
    cfop: card.querySelector(".cte-cfop")?.value || null,
    cst: card.querySelector(".cte-cst")?.value || null,
    aliquota: card.querySelector(".cte-aliquota")?.value || null,
    obs: card.querySelector(".obs")?.value?.trim() || null,
  };
}


    // MDFe
if (doc === "MDFe") {
  conf[doc].mdfe = {
    serie: card.querySelector(".mdfe-serie")?.value || null,
    numero: card.querySelector(".mdfe-numero")?.value || null,
    tipoTransportador: card.querySelector(".mdfe-tipo-transp")?.value || null,
    rntrc: card.querySelector(".mdfe-rntrc")?.value || null,
    tipoEmitente: card.querySelector(".mdfe-tipo-emit")?.value || null,
    obs: card.querySelector(".obs")?.value?.trim() || null,
  };
}


  });

  return conf;
}


// Monta payload final

function buildPayload() {
  const selectedDocs = Array.from(docChecks)
    .filter(c => c.checked)
    .map(c => c.value);

  const payload = {
    contabilidade: {
      nome: document.getElementById("cont_nome").value.trim(),
      telefone: document.getElementById("cont_tel").value.trim(),
    },
    empresa: {
      razaoSocial: document.getElementById("emp_razao").value.trim(),
      cnpj: document.getElementById("emp_cnpj").value.trim(),
      ie: document.getElementById("emp_ie").value.trim(),
      crt: empCrt.value,
      certSenha: document.getElementById("emp_cert_senha")?.value || null,
    },
    documentos: {
      selecionados: selectedDocs,
      nfeNfceMesmosDados: !!nfeNfceMesmo.checked,
    },
    configPorDocumento: collectConfigDocs()
  };

  // ✅ Reforma Tributária separada (FORA do objeto)
  if (rtHabilitar.checked) {

    const reformaPorDoc = {};

    document.querySelectorAll("#rtTabContent .docPanel").forEach(panel => {
      

        const doc = panel.dataset.doc;
        if (doc === "NFSe") {
  reformaPorDoc[doc] = {
    municipio: panel.querySelector(".rt_municipio")?.value || null,
    ibs: panel.querySelector(".rt_ibs")?.value || null,
    diferimento: panel.querySelector(".rt_diferimento")?.value || null,
    reducao: panel.querySelector(".rt_reducao")?.value || null,
  };
  return;
}

        reformaPorDoc[doc] = {
          cst: panel.querySelector(".rt_cst")?.value || null,
          classTrib: panel.querySelector(".rt_class")?.value || null,
          cbs: panel.querySelector(".rt_cbs")?.value || null,
          ibs: panel.querySelector(".rt_ibs")?.value || null,
          deduzIcms: panel.querySelector(".rt_deduz_icms")?.value || "nao",
          credito: panel.querySelector(".rt_credito")?.value || null,
percCreditoCBS: panel.querySelector(".rt_perc_cbs")?.value || null,
percCreditoIBS: panel.querySelector(".rt_perc_ibs")?.value || null,

        };

      });

    payload.reformaTributaria = {
      habilitar: true,
      porDocumento: reformaPorDoc
    };

  } else {

    payload.reformaTributaria = { habilitar: false };

  }

  return payload;
}


function renderPreview() {
  const payload = buildPayload();

  // JSON técnico
  previewEl.textContent = JSON.stringify(payload, null, 2);

  // Visual bonito
  const nice = document.getElementById("previewNice");
  nice.innerHTML = "";

  const bloco = (titulo, itens) => {
    const div = document.createElement("div");
    div.className = "review-card";
    div.innerHTML = `<h3>${titulo}</h3>` +
      itens.map(i => `<div class="review-item"><strong>${i.label}:</strong> ${i.value || "-"}</div>`).join("");
    nice.appendChild(div);
  };

  bloco("Contabilidade", [
    { label: "Nome", value: payload.contabilidade.nome },
    { label: "Telefone", value: payload.contabilidade.telefone },
  ]);

  bloco("Empresa", [
    { label: "Razão Social", value: payload.empresa.razaoSocial },
    { label: "CNPJ/CPF", value: payload.empresa.cnpj },
    { label: "Inscrição Estadual", value: payload.empresa.ie },
    { label: "CRT", value: payload.empresa.crt },
  ]);

  bloco("Documentos Selecionados", [
    { label: "Documentos", value: payload.documentos.selecionados.join(", ") || "Nenhum" },
    { label: "NF-e/NFC-e mesmos dados", value: payload.documentos.nfeNfceMesmosDados ? "Sim" : "Não" },
  ]);

  if (payload.reformaTributaria?.habilitar) {

  Object.entries(payload.reformaTributaria.porDocumento)
    .forEach(([doc, rt]) => {

      if (rt.municipio) {

        bloco(`Reforma Tributária - ${doc}`, [
          { label: "Município", value: rt.municipio },
          { label: "Alíquota IBS", value: rt.ibs },
          { label: "Diferimento IBS", value: rt.diferimento },
          { label: "Redução IBS", value: rt.reducao },
        ]);

      } else {

        bloco(`Reforma Tributária - ${doc}`, [
          { label: "CST CBS/IBS", value: rt.cst },
          { label: "Classificação", value: rt.classTrib },
          { label: "CBS (%)", value: rt.cbs },
          { label: "IBS (%)", value: rt.ibs },
          { label: "Deduz ICMS", value: rt.deduzIcms === "sim" ? "Sim" : "Não" },
          { label: "Crédito", value: rt.credito },
        ]);

      }

    });
}


}

// Submit: envia multipart (payload + certificado)
formWizard.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "";

  // ===============================
// 🔎 VALIDAÇÕES FISCAIS
// ===============================

const normalize = (v) => {
  if (!v) return null;
  return parseFloat(String(v).replace(",", ".")).toFixed(2);
};

document.querySelectorAll(".docPanel").forEach(panel => {

  const pisSit = panel.querySelector(".pisSituacao")?.value;
  const pisAliqRaw = panel.querySelector(".pisAliquota")?.value;

  const cofSit = panel.querySelector(".cofinsSituacao")?.value;
  const cofAliqRaw = panel.querySelector(".cofinsAliquota")?.value;

  const icmsCodigo = panel.querySelector(".icmsCodigo")?.value;
  const icmsAliqRaw = panel.querySelector(".icmsAliquota")?.value;

  const pisAliq = normalize(pisAliqRaw);
  const cofAliq = normalize(cofAliqRaw);
  const icmsAliq = normalize(icmsAliqRaw);

  // ---------- PIS 01 ----------
  if (pisSit === "01") {
    if (!["0.65", "1.65"].includes(pisAliq)) {
      throw new Error("PIS 01 só permite 0,65% ou 1,65%");
    }
  }

  // ---------- COFINS 01 ----------
  if (cofSit === "01") {
    if (!["3.00", "7.60"].includes(cofAliq)) {
      throw new Error("COFINS 01 só permite 3,00% ou 7,60%");
    }
  }

  // ---------- ICMS CST 00 ----------
  if (icmsCodigo === "00") {
    if (!icmsAliq || parseFloat(icmsAliq) <= 0) {
      throw new Error("CST 00 exige alíquota de ICMS obrigatória.");
    }
  }

});


  const payload = buildPayload();
  const certFile = document.getElementById("emp_cert").files?.[0] || null;

  const fd = new FormData();
  fd.append("payload", JSON.stringify(payload));
  if (certFile) fd.append("certificado", certFile);

  

  try {
    statusEl.textContent = "Enviando...";
    const resp = await fetch(API_URL, { method: "POST", body: fd });
    const data = await resp.json();

    if (!resp.ok || !data.ok) {
      throw new Error(data?.error || "Falha ao enviar");
    }

    statusEl.textContent = "✅ Enviado com sucesso! O suporte recebeu o PDF por e-mail.";
  } catch (err) {
    statusEl.textContent = `❌ Erro: ${err.message}`;
  }
});

function maskTelefone(value) {
  value = value.replace(/\D/g, "").slice(0, 11); // 2 DDD + 9 número

  if (value.length <= 10) {
    return value.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  }
  return value.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}


const telInput = document.getElementById("cont_tel");
telInput.addEventListener("input", () => {
  telInput.value = maskTelefone(telInput.value);
});

function maskCpfCnpj(value) {
  value = value.replace(/\D/g, "");

  if (value.length <= 11) {
    return value
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
  }

  return value
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5");
}

const cnpjInput = document.getElementById("emp_cnpj");
cnpjInput.addEventListener("input", () => {
  let raw = cnpjInput.value.replace(/\D/g, "").slice(0, 14);
  cnpjInput.value = maskCpfCnpj(raw);
});



const CSOSN_LIST = [
  ["02", "02 - Tributação monofásica própria sobre combustíveis"],
  ["15", "15 - Tributação monofásica própria e com responsabilidade pela retenção sobre combustíveis"],
  ["53", "53 - Tributação monofásica sobre combustíveis com recolhimento diferido"],
  ["61", "61 - Tributação monofásica sobre combustíveis cobrada anteriormente"],
  ["101", "101 - Simples Nacional - Tributada pelo Simples Nacional com permissão de crédito"],
  ["102", "102 - Simples Nacional - Tributada pelo Simples Nacional sem permissão de crédito"],
  ["103", "103 - Simples Nacional - Isenção do ICMS no Simples Nacional para faixa de receita bruta"],
  ["300", "300 - Simples Nacional - Imune"],
  ["400", "400 - Simples Nacional - Não tributada pelo Simples Nacional"],
  ["500", "500 - Simples Nacional - ICMS cobrado anteriormente por substituição tributária (substituído) ou por antecipação"],
  ["900", "900 - Simples Nacional - Outros"],
];

const CST_LIST = [
  ["00", "00 - Tributada integralmente"],
  ["02", "02 - Tributação monofásica própria sobre combustíveis"],
  ["10", "10 - Tributada e com cobrança do ICMS por substituição tributária"],
  ["15", "15 - Tributação monofásica própria e com responsabilidade pela retenção sobre combustíveis"],
  ["20", "20 - Com redução de base de cálculo"],
  ["30", "30 - Isenta ou não tributada e com cobrança do ICMS por substituição tributária"],
  ["40", "40 - Isenta"],
  ["41", "41 - Não tributada"],
  ["50", "50 - Suspensão"],
  ["51", "51 - Diferimento"],
  ["53", "53 - Tributação monofásica sobre combustíveis com recolhimento diferido"],
  ["60", "60 - ICMS cobrado anteriormente por substituição tributária"],
  ["61", "61 - Tributação monofásica sobre combustíveis cobrada anteriormente"],
  ["70", "62 - Com redução de base de cálculo e cobrança do ICMS por substituição tributária"],
  ["90", "63 - Outras"],
];



function hydrateICMSSelectsInsideTabs() {
  const { tipo, lista } = getListaICMSPorCRT();

  // para cada aba NFe/NFCe, preencher o select .icmsCodigo
  document.querySelectorAll(".docPanel").forEach(panel => {
    const icmsSelect = panel.querySelector(".icmsCodigo");
    const hint = panel.querySelector(".docHint");
    if (!icmsSelect) return;

    icmsSelect.innerHTML = "";
    lista.forEach(([codigo, desc]) => {
      const opt = document.createElement("option");
      opt.value = codigo;
      opt.textContent = `${codigo} - ${desc}`;
      icmsSelect.appendChild(opt);
    });

    const icmsAliqInput = panel.querySelector(".icmsAliquota");

const applyIcmsAliqRule = () => {
  if (!icmsAliqInput) return;

  if (icmsSelect.value === "00") {
    icmsAliqInput.required = true;
    icmsAliqInput.disabled = false;
  } else {
    icmsAliqInput.required = false;
    icmsAliqInput.value = "";
    icmsAliqInput.disabled = true;
  }
};

// remove listeners antigos
icmsSelect.onchange = null;
icmsSelect.addEventListener("change", applyIcmsAliqRule);

// aplica uma vez
applyIcmsAliqRule();


    if (hint) {
      hint.textContent = tipo
        ? `Pelo CRT selecionado, o tipo esperado é ${tipo} (aplicado automaticamente).`
        : "Selecione o CRT na etapa Empresa para carregar CST/CSOSN.";
    }
  });
}


function bindPisCofinsInsideTabs() {
  // para cada painel que tiver PIS/COFINS
  document.querySelectorAll(".docPanel").forEach(panel => {
    const pisSituacao = panel.querySelector(".pisSituacao");
    const pisAliquota = panel.querySelector(".pisAliquota");
    const cofinsSituacao = panel.querySelector(".cofinsSituacao");
    const cofinsAliquota = panel.querySelector(".cofinsAliquota");
    if (!pisSituacao || !pisAliquota || !cofinsSituacao || !cofinsAliquota) return;

    const aplicar = (inputAliq, situacao) => {
      const ALIQ_OBRIGATORIA = new Set(["01", "02"]);
      const ALIQ_OPCIONAL = new Set(["49", "99"]);
      if (!situacao) {
        inputAliq.value = "";
        inputAliq.disabled = true;
        inputAliq.required = false;
        return;
      }
      if (ALIQ_OBRIGATORIA.has(situacao)) {
        inputAliq.disabled = false;
        inputAliq.required = true;
        return;
      }
      if (ALIQ_OPCIONAL.has(situacao)) {
        inputAliq.disabled = false;
        inputAliq.required = false;
        return;
      }
      inputAliq.value = "";
      inputAliq.disabled = true;
      inputAliq.required = false;
    };

    // espelha PIS -> COFINS
    pisSituacao.addEventListener("change", () => {
  const value = pisSituacao.value;

  if (cofinsSituacao.tomselect) {
    cofinsSituacao.tomselect.setValue(value);
  } else {
    cofinsSituacao.value = value;
  }

  aplicar(pisAliquota, value);
  aplicar(cofinsAliquota, value);
});

cofinsSituacao.addEventListener("change", () => {
  const value = cofinsSituacao.value;

  if (pisSituacao.tomselect) {
    pisSituacao.tomselect.setValue(value);
  } else {
    pisSituacao.value = value;
  }

  aplicar(pisAliquota, value);
  aplicar(cofinsAliquota, value);
});

  });
}

function bindEfdPisCofinsAliquota(panel) {
  const saida = panel.querySelector(".efd-piscofins-saida");
  const aliq  = panel.querySelector(".efd-piscofins-aliquota");
  if (!saida || !aliq) return;

  const exigeAliq = new Set(["01", "02", "03"]); // tributáveis (ajuste se quiser)
  const apply = () => {
    if (exigeAliq.has(saida.value)) {
      aliq.disabled = false;
      aliq.required = true;
    } else {
      aliq.value = "";
      aliq.disabled = true;
      aliq.required = false;
    }
  };

  saida.addEventListener("change", apply);
  apply();
}

function aplicarPadraoSimples(panel, tipo) {

  const icmsCodigo = panel.querySelector(".icmsCodigo");
  const icmsCfop = panel.querySelector(".icmsCfop");
  const pisSituacao = panel.querySelector(".pisSituacao");
  const cofinsSituacao = panel.querySelector(".cofinsSituacao");

  if (!icmsCodigo) return;

  if (tipo === "normal") {

    icmsCodigo.tomselect?.setValue("102");
    icmsCfop.value = panel.id.includes("NFCe") ? "5102" : "5102/6102";

  }

  if (tipo === "st") {

    icmsCodigo.tomselect?.setValue("500");
    icmsCfop.value = panel.id.includes("NFCe") ? "5405" : "5405/6405";

  }

  pisSituacao.tomselect?.setValue("08");
  cofinsSituacao.tomselect?.setValue("08");

  pisSituacao.dispatchEvent(new Event("change"));
}


function bindPadraoSimples() {
  document.querySelectorAll(".docPanel").forEach(panel => {
    panel.querySelectorAll(".simplesPadrao input[type=radio]").forEach(radio => {
      radio.addEventListener("change", () => {
        aplicarPadraoSimples(panel, radio.value);
      });
    });
  });
}

document.addEventListener('change', (e) => {
  if (e.target.classList.contains('efd-plano-arquivo')) {
    const label = e.target
      .closest('.fileBox')
      .querySelector('span');

    if (e.target.files.length > 0) {
      label.textContent = `📎 ${e.target.files[0].name}`;
    }
  }
});
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function renderRTTabs() {
  
  const selecionados = Array.from(docChecks)
    .filter(c => c.checked)
    .map(c => c.value);

  const tabs = document.getElementById("rtTabs");
  const content = document.getElementById("rtTabContent");

  tabs.innerHTML = "";
  content.innerHTML = "";

  selecionados.forEach((docKey, index) => {

    const config = RT_MAP[docKey];
    if (!config) return;

    // =========================
    // 🔵 CASO ESPECIAL NFSe
    // =========================
    if (config.especial) {

      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "docTab" + (index === 0 ? " active" : "");
      tab.textContent = docLabels[docKey];
      tabs.appendChild(tab);

      const panel = document.createElement("div");
      panel.className = "docPanel" + (index === 0 ? " show" : "");

      panel.innerHTML = `
        <div class="docCard">
          <h3>Reforma Tributária - NFS-e</h3>

          <label>Município da Prestação
            <input type="text" class="rt_municipio">
          </label>

          <label>Alíquota IBS (%)
            <input type="number" step="0.01" class="rt_ibs">
          </label>

          <label>Diferimento IBS (%)
            <input type="number" step="0.01" class="rt_diferimento">
          </label>

          <label>Redução IBS (%)
            <input type="number" step="0.01" class="rt_reducao">
          </label>
        </div>
      `;

      content.appendChild(panel);
panel.dataset.doc = docKey;

      tab.addEventListener("click", () => {
        document.querySelectorAll("#rtTabs .docTab")
          .forEach(t => t.classList.remove("active"));
        document.querySelectorAll("#rtTabContent .docPanel")
          .forEach(p => p.classList.remove("show"));

        tab.classList.add("active");
        panel.classList.add("show");
      });

      return;
    }

    // =========================
    // 🟢 DOCUMENTOS NORMAIS
    // =========================

    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "docTab" + (index === 0 ? " active" : "");
    tab.textContent = docLabels[docKey];
    tabs.appendChild(tab);

    const panel = document.createElement("div");
    panel.className = "docPanel" + (index === 0 ? " show" : "");

    const tpl = document.getElementById("tplRTDoc")
      .content.cloneNode(true);

    tpl.querySelector(".rtDocTitle").textContent =
      "Reforma Tributária - " + docLabels[docKey];

    panel.appendChild(tpl);
    content.appendChild(panel);

    const cstSelect = panel.querySelector(".rt_cst");
    const classSelect = panel.querySelector(".rt_class");

    cstSelect.innerHTML = '<option value="">Selecione</option>';
    classSelect.innerHTML = '<option value="" disabled selected>Selecione</option>';

    // CST
    config.cst.forEach(code => {
      const opt = document.createElement("option");
      opt.value = code;
      opt.textContent = CBS_IBS_CST_MAP[code];
      cstSelect.appendChild(opt);
    });

    // Classificação
    if (config.classTrib === "ALL") {
      Object.keys(CLASS_TRIB_MAP).forEach(code => {
        const opt = document.createElement("option");
        opt.value = code;
        opt.textContent = CLASS_TRIB_MAP[code];
        classSelect.appendChild(opt);
      });
    } else {
     config.classTrib.forEach(item => {
  const opt = document.createElement("option");
  opt.value = item.code;
  opt.textContent = `${item.code} - ${item.desc}`;
  classSelect.appendChild(opt);
});

    }

    // 🔵 CONTROLAR CAMPOS VISÍVEIS
    const campos = config.campos || [];

    if (!campos.includes("cbs"))
      panel.querySelector(".rt_cbs")?.closest("label")?.remove();

    if (!campos.includes("ibs"))
      panel.querySelector(".rt_ibs")?.closest("label")?.remove();

    if (!campos.includes("deduzICMS"))
      panel.querySelector(".rt_deduz_icms")?.closest("label")?.remove();

    if (!campos.includes("deduzIPI"))
      panel.querySelector(".rt_deduz_ipi")?.closest("label")?.remove();

    if (!campos.includes("deduzPISCOFINS"))
      panel.querySelector(".rt_deduz_piscofins")?.closest("label")?.remove();
    // Crédito Presumido
if (!config.creditoPresumido || config.creditoPresumido.length === 0) {
  panel.querySelector(".rt_credito_box")?.remove();
  panel.querySelector(".rt_perc_cbs_box")?.remove();
  panel.querySelector(".rt_perc_ibs_box")?.remove();
} else {
  const selectCredito = panel.querySelector(".rt_credito");
  selectCredito.innerHTML = '<option value="" disabled selected>Selecione</option>';

  config.creditoPresumido.forEach(item => {
  const opt = document.createElement("option");
  opt.value = item.code;
  opt.textContent = `${item.code} - ${item.desc}`;
  selectCredito.appendChild(opt);
});

}


    tab.addEventListener("click", () => {
      document.querySelectorAll("#rtTabs .docTab")
        .forEach(t => t.classList.remove("active"));
      document.querySelectorAll("#rtTabContent .docPanel")
        .forEach(p => p.classList.remove("show"));

      tab.classList.add("active");
      panel.classList.add("show");
    });

  });
  initCustomSelects();

}


function initCustomSelects(scope = document) {

  scope.querySelectorAll("select").forEach(select => {

    // NÃO destruir select já inicializado
    if (select.tomselect) return;

  new TomSelect(select, {
  create: false,
  closeAfterSelect: true,
  allowEmptyOption: true,
  search: false,
  controlInput: null,
  dropdownParent: 'body',   // 🔥 ESSA É A CHAVE
  render: {
    no_results: () => ''
  }
});


  });
}




// Iniciar
showStep(0);
initCustomSelects();

