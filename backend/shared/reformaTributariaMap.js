export const CBS_IBS_CST_MAP = {
  "000": "000 - Tributação integral",
  "200_ZERO": "200 - Alíquota zero",
  "200_60": "200 - Alíquota reduzida em 60%",
  "200_40": "200 - Alíquota reduzida em 40%",
  "410": "410 - Imunidade e não incidência",
  "510": "510 - Diferimento",
  "515": "515 - Diferimento com redução de alíquota",
  "550": "550 - Suspensão",
  "620": "620 - Tributação monofásica",
  "800": "800 - Transferência de crédito",
  "810": "810 - Ajuste de IBS na ZFM",
  "811": "811 - Ajustes",
  "830": "830 - Exclusão de base de cálculo"
};

export const CLASS_TRIB_MAP = {
  "000001": "000001 - Situações tributadas integralmente pelo IBS e CBS.",
  "200002": "200002 - Fornecimento ou importação de tratores...",
  "200003": "200003 - Vendas de produtos destinados à alimentação humana...",
  "410001": "410001 - Fornecimento de bonificações...",
  "410003": "410003 - Doações...",
  "410004": "410004 - Exportações...",
  "410999": "410999 - Operações não onerosas..."
};


export const RT_MAP = {

  // =========================
  // 🔵 NFE
  // =========================
  NFe: {
    campos: ["cbs","ibs","deduzICMS","credito"],

    cst: [
      "000",
      "200_ZERO",
      "200_60",
      "200_40",
      "410",
      "510",
      "515",
      "550",
      "620",
      "800",
      "810",
      "811",
      "830"
    ],

classTrib: [

  { code: "000001", desc: "Situações tributadas integralmente pelo IBS e CBS." },
  { code: "000003", desc: "Regime automotivo - projetos incentivados, observado o art. 311 da Lei Complementar nº 214, de 2025." },
  { code: "000004", desc: "Regime automotivo - projetos incentivados, observado o art. 312 da Lei Complementar nº 214, de 2025." },

  { code: "200001", desc: "Aquisições de máquinas, aparelhos, instrumentos, equipamentos, matérias-primas, produtos intermediários e materiais de embalagem realizadas entre empresas autorizadas a operar em ZPE, observado o art. 103 da LC 214/2025." },
  { code: "200002", desc: "Fornecimento ou importação de tratores, máquinas e implementos agrícolas destinados a produtor rural não contribuinte e veículos destinados a TAC pessoa física não contribuinte, observado o art. 110 da LC 214/2025." },
  { code: "200003", desc: "Vendas de produtos destinados à alimentação humana constantes do Anexo I da LC 214/2025 (Cesta Básica Nacional de Alimentos)." },
  { code: "200004", desc: "Venda de dispositivos médicos previstos no Anexo XII da LC 214/2025, observado o art. 144." },
  { code: "200005", desc: "Venda de dispositivos médicos do Anexo IV da LC 214/2025 adquiridos pela administração pública, observado o art. 144." },
  { code: "200006", desc: "Inclusão excepcional de dispositivos médicos em situação de emergência de saúde pública, conforme ato conjunto (LC 214/2025)." },
  { code: "200007", desc: "Fornecimento de dispositivos de acessibilidade do Anexo XIII da LC 214/2025, observado o art. 145." },
  { code: "200008", desc: "Fornecimento de dispositivos de acessibilidade do Anexo V da LC 214/2025 adquiridos pela administração pública." },
  { code: "200009", desc: "Fornecimento de medicamentos do Anexo XIV da LC 214/2025, observado o art. 146." },
  { code: "200010", desc: "Fornecimento de medicamentos registrados na Anvisa adquiridos pela administração pública, observado o art. 146." },
  { code: "200011", desc: "Fornecimento de composições para nutrição enteral e parenteral do Anexo VI da LC 214/2025 adquiridas pela administração pública." },
  { code: "200012", desc: "Inclusão excepcional de medicamentos em situação de emergência de saúde pública, conforme LC 214/2025." },
  { code: "200013", desc: "Fornecimento de absorventes, tampões, calcinhas absorventes e coletores menstruais, observado o art. 147 da LC 214/2025." },
  { code: "200014", desc: "Fornecimento de produtos hortícolas, frutas e ovos do Anexo XV da LC 214/2025." },
  { code: "200015", desc: "Venda de automóveis adquiridos por motoristas profissionais autônomos, observado o art. 149 da LC 214/2025." },
  { code: "200020", desc: "Operações praticadas por cooperativas optantes por regime específico, observado o art. 271 da LC 214/2025." },
  { code: "200022", desc: "Operação originada fora da ZFM com destino a contribuinte habilitado na ZFM, observado o art. 442 da LC 214/2025." },
  { code: "200023", desc: "Operação entre indústrias incentivadas na ZFM, observado o art. 448 da LC 214/2025." },
  { code: "200024", desc: "Operação originada fora das Áreas de Livre Comércio destinada a contribuinte habilitado nessas áreas, observado o art. 456 da LC 214/2025." },
  { code: "200030", desc: "Venda de dispositivos médicos do Anexo IV da LC 214/2025, observado o art. 131." },
  { code: "200031", desc: "Fornecimento de dispositivos de acessibilidade do Anexo V da LC 214/2025, observado o art. 132." },
  { code: "200032", desc: "Fornecimento de medicamentos registrados na Anvisa ou manipulados, observado o art. 133 da LC 214/2025." },
  { code: "200033", desc: "Fornecimento de composições para nutrição do Anexo VI da LC 214/2025, observado o art. 133." },
  { code: "200034", desc: "Fornecimento de alimentos do Anexo VII da LC 214/2025, observado o art. 135." },
  { code: "200035", desc: "Fornecimento de produtos de higiene e limpeza do Anexo VIII da LC 214/2025, observado o art. 136." },
  { code: "200036", desc: "Fornecimento de produtos agropecuários, aquícolas, pesqueiros e extrativistas in natura, observado o art. 137." },
  { code: "200038", desc: "Fornecimento de insumos agropecuários e aquícolas do Anexo IX da LC 214/2025, observado o art. 138." },
  { code: "200039", desc: "Fornecimento de serviços culturais e artísticos do Anexo X da LC 214/2025." },
  { code: "200043", desc: "Fornecimento à administração pública de bens e serviços relativos à soberania e segurança nacional (Anexo XI da LC 214/2025)." },
  { code: "200044", desc: "Serviços de segurança da informação e cibernética (Anexo XI da LC 214/2025)." },
  { code: "200047", desc: "Bares e restaurantes, observado o art. 275 da LC 214/2025." },

  { code: "410001", desc: "Bonificações constantes no documento fiscal, observado o art. 5º da LC 214/2025." },
  { code: "410002", desc: "Transferências entre estabelecimentos do mesmo contribuinte, observado o art. 6º." },
  { code: "410003", desc: "Doações sem crédito apropriado pelo doador, observado o art. 6º." },
  { code: "410004", desc: "Exportações de bens e serviços, observado o art. 8º." },
  { code: "410005", desc: "Fornecimentos realizados pela União, Estados, DF e Municípios." },
  { code: "410006", desc: "Fornecimentos realizados por entidades religiosas." },
  { code: "410007", desc: "Fornecimentos realizados por partidos políticos e entidades sem fins lucrativos." },
  { code: "410008", desc: "Fornecimentos de livros, jornais e periódicos." },
  { code: "410009", desc: "Fornecimentos de fonogramas e videofonogramas musicais produzidos no Brasil." },
  { code: "410012", desc: "Fornecimento de condomínio edilício não optante pelo regime regular." },
  { code: "410013", desc: "Exportações de combustíveis." },
  { code: "410014", desc: "Fornecimento de produtor rural não contribuinte." },
  { code: "410016", desc: "Fornecimento ou aquisição de resíduos sólidos." },
  { code: "410017", desc: "Aquisição de bem móvel com crédito presumido sob condição de revenda." },
  { code: "410019", desc: "Exclusão da gorjeta na base de cálculo no fornecimento de alimentação." },
  { code: "410020", desc: "Exclusão do valor de intermediação na base de cálculo no fornecimento de alimentação." },
  { code: "410026", desc: "Doações com anulação de crédito apropriado." },
  { code: "410029", desc: "Operações acobertadas somente pelo ICMS." },
  { code: "410030", desc: "Estorno de crédito por perecimento, deterioração, roubo ou extravio." },
  { code: "410031", desc: "Fornecimento em período anterior ao início de vigência da CBS e IBS." },
  { code: "410999", desc: "Operações não onerosas sem previsão de tributação, observado o art. 4º." },

  { code: "510001", desc: "Operações sujeitas a diferimento com energia elétrica." },
  { code: "515001", desc: "Operações sujeitas a diferimento com insumos agropecuários." },

  { code: "550001", desc: "Exportações de bens materiais." },
  { code: "550002", desc: "Regime de Trânsito." },
  { code: "550003", desc: "Regimes de Depósito." },
  { code: "550006", desc: "Regimes de Permanência Temporária." },
  { code: "550007", desc: "Regimes de Aperfeiçoamento." },
  { code: "550014", desc: "Zona de Processamento de Exportação." },

  { code: "620001", desc: "Tributação monofásica sobre combustíveis." },
  { code: "620002", desc: "Tributação monofásica com responsabilidade pela retenção." },
  { code: "620006", desc: "Tributação monofásica sobre combustíveis cobrada anteriormente." },

  { code: "800001", desc: "Fusão, cisão ou incorporação." },
  { code: "800002", desc: "Transferência de crédito do associado para cooperativa." },

  { code: "810001", desc: "Crédito presumido sobre fornecimentos a partir da ZFM." },

  { code: "811001", desc: "Anulação de crédito proporcional." },
  { code: "811002", desc: "Débitos de notas fiscais não processadas." },

  { code: "830001", desc: "Documento com exclusão da base de cálculo da CBS e IBS referente à energia elétrica (art. 28)." }

],

creditoPresumido: [

  {
    code: "1",
    desc: "Aquisição de bens e serviços de produtor rural e produtor rural integrado não contribuinte, observado o art. 168 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "2",
    desc: "Aquisição de serviço de transportador autônomo de carga pessoa física não contribuinte, observado o art. 169 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "3",
    desc: "Aquisição de resíduos e demais materiais destinados à reciclagem, reutilização ou logística reversa adquiridos de pessoa física, cooperativa ou organização popular, observado o art. 170 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "4",
    desc: "Aquisição de bens móveis usados de pessoa física não contribuinte para revenda, observado o art. 171 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "5",
    desc: "Regime automotivo, observado o art. 310 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "6",
    desc: "Regime automotivo, observado o art. 311 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "7",
    desc: "Aquisição por contribuinte na Zona Franca de Manaus, observado o art. 444 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "8",
    desc: "Aquisição por contribuinte na Zona Franca de Manaus, observado o art. 447 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "9",
    desc: "Aquisição por contribuinte na Zona Franca de Manaus, observado o art. 447 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "10",
    desc: "Aquisição por contribuinte na Zona Franca de Manaus, observado o art. 450 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "11",
    desc: "Aquisição por contribuinte na Área de Livre Comércio, observado o art. 462 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "12",
    desc: "Aquisição por contribuinte na Área de Livre Comércio, observado o art. 465 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "13",
    desc: "Aquisição pela indústria na Área de Livre Comércio, observado o art. 467 da Lei Complementar nº 214, de 2025."
  }

]



    
  },

  // =========================
  // 🟢 NFCe
  // =========================
  NFCe: {
    campos: ["cbs","ibs","deduzICMS","credito"],

    cst: [
      "000",
      "200_ZERO",
      "200_60",
      "200_40",
      "410",
      "620"
    ],

    classTrib: [

  { code: "000001", desc: "Situações tributadas integralmente pelo IBS e CBS." },

  { code: "200002", desc: "Fornecimento ou importação de tratores, máquinas e implementos agrícolas, destinados a produtor rural não contribuinte, e de veículos de transporte de carga destinados a transportador autônomo de carga pessoa física não contribuinte, observado o art. 110 da Lei Complementar nº 214, de 2025." },

  { code: "200003", desc: "Vendas de produtos destinados à alimentação humana relacionados no Anexo I da Lei Complementar nº 214, de 2025, que compõem a Cesta Básica Nacional de Alimentos." },

  { code: "200004", desc: "Venda de dispositivos médicos previstos no Anexo XII da Lei Complementar nº 214, de 2025, observado o art. 144." },

  { code: "200006", desc: "Situação de emergência de saúde pública reconhecida pelo Poder Legislativo competente, podendo incluir dispositivos não listados no Anexo XII da Lei Complementar nº 214, de 2025." },

  { code: "200007", desc: "Fornecimento dos dispositivos de acessibilidade próprios para pessoas com deficiência relacionados no Anexo XIII da Lei Complementar nº 214, de 2025." },

  { code: "200009", desc: "Fornecimento dos medicamentos relacionados no Anexo XIV da Lei Complementar nº 214, de 2025." },

  { code: "200010", desc: "Fornecimento dos medicamentos registrados na Anvisa quando adquiridos por órgãos da administração pública direta, autarquias, fundações públicas e entidades imunes." },

  { code: "200012", desc: "Situação de emergência de saúde pública para inclusão de dispositivos não listados no Anexo XIV da Lei Complementar nº 214, de 2025." },

  { code: "200013", desc: "Fornecimento de tampões higiênicos, absorventes, calcinhas absorventes e coletores menstruais, observado o art. 147 da Lei Complementar nº 214, de 2025." },

  { code: "200014", desc: "Fornecimento de produtos hortícolas, frutas e ovos, relacionados no Anexo XV da Lei Complementar nº 214, de 2025." },

  { code: "200015", desc: "Venda de automóveis de passageiros para motoristas profissionais autônomos, observado o art. 110 da Lei Complementar nº 214, de 2025." },

  { code: "200020", desc: "Operação praticada por sociedades cooperativas optantes por regime específico do IBS e CBS, observado o art. 271 da Lei Complementar nº 214, de 2025." },

  { code: "200030", desc: "Venda dos dispositivos médicos relacionados no Anexo IV da Lei Complementar nº 214, de 2025." },

  { code: "200031", desc: "Fornecimento dos dispositivos de acessibilidade relacionados no Anexo V da Lei Complementar nº 214, de 2025." },

  { code: "200032", desc: "Fornecimento dos medicamentos registrados na Anvisa ou produzidos por farmácias de manipulação, observado o art. 133 da Lei Complementar nº 214, de 2025." },

  { code: "200033", desc: "Fornecimento das composições para nutrição enteral e parenteral, fórmulas nutricionais do Anexo VI da Lei Complementar nº 214, de 2025." },

  { code: "200034", desc: "Fornecimento dos alimentos destinados ao consumo humano relacionados no Anexo VII da Lei Complementar nº 214, de 2025." },

  { code: "200035", desc: "Fornecimento dos produtos de higiene pessoal e limpeza relacionados no Anexo VIII da Lei Complementar nº 214, de 2025." },

  { code: "200036", desc: "Fornecimento de produtos agropecuários, aquícolas, pesqueiros, florestais e extrativistas vegetais in natura." },

  { code: "200038", desc: "Fornecimento dos insumos agropecuários e aquícolas relacionados no Anexo IX da Lei Complementar nº 214, de 2025." },

  { code: "200044", desc: "Operações e prestações de serviços de segurança da informação e segurança cibernética relacionados no Anexo XI da Lei Complementar nº 214, de 2025." },

  { code: "200047", desc: "Bares e Restaurantes, observado o art. 275 da Lei Complementar nº 214, de 2025." },

  { code: "410001", desc: "Fornecimento de bonificações quando constem no documento fiscal, observado o art. 5º da Lei Complementar nº 214, de 2025." },

  { code: "410003", desc: "Doações que não tenham permitido apropriação de crédito pelo doador, observado o art. 6º da Lei Complementar nº 214, de 2025." },

  { code: "410005", desc: "Fornecimentos realizados pela União, Estados, DF e Municípios, observado o art. 9º da Lei Complementar nº 214, de 2025." },

  { code: "410006", desc: "Fornecimentos realizados por entidades religiosas e templos de qualquer culto." },

  { code: "410007", desc: "Fornecimentos realizados por partidos políticos, fundações, entidades sindicais e instituições sem fins lucrativos." },

  { code: "410008", desc: "Fornecimentos de livros, jornais, periódicos e papel destinado à sua impressão." },

  { code: "410009", desc: "Fornecimentos de fonogramas e videofonogramas musicais produzidos no Brasil." },

  { code: "410012", desc: "Fornecimento de condomínio edilício não optante pelo regime regular." },

  { code: "410014", desc: "Fornecimento de produtor rural não contribuinte." },

  { code: "410019", desc: "Exclusão da gorjeta na base de cálculo no fornecimento de alimentação." },

  { code: "410020", desc: "Exclusão do valor de intermediação na base de cálculo no fornecimento de alimentação." },

  { code: "410026", desc: "Doações sem contraprestação com anulação de crédito apropriado pelo doador." },

  { code: "410029", desc: "Operações acobertadas somente pelo ICMS." },

  { code: "410999", desc: "Operações não onerosas sem previsão de tributação." },

  { code: "620001", desc: "Tributação monofásica sobre combustíveis, art. 172 e art. 179 I da Lei Complementar nº 214, de 2025." },

  { code: "620002", desc: "Tributação monofásica com responsabilidade pela retenção sobre combustíveis." },

  { code: "620003", desc: "Tributação monofásica com tributos retidos por responsabilidade sobre combustíveis." },

  { code: "620004", desc: "Tributação monofásica sobre mistura de EAC com gasolina A." },

  { code: "620005", desc: "Tributação monofásica sobre mistura de EAC com gasolina A." },

  { code: "620006", desc: "Tributação monofásica sobre combustíveis cobrada anteriormente." }

]
,

    creditoPresumido: [

  {
    code: "1",
    desc: "Aquisição de bens e serviços de produtor rural e produtor rural integrado não contribuinte, observado o art. 168 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "2",
    desc: "Aquisição de serviço de transportador autônomo de carga pessoa física não contribuinte, observado o art. 169 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "3",
    desc: "Aquisição de resíduos e demais materiais destinados à reciclagem, reutilização ou logística reversa adquiridos de pessoa física, cooperativa ou organização popular, observado o art. 170 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "4",
    desc: "Aquisição de bens móveis usados de pessoa física não contribuinte para revenda, observado o art. 171 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "5",
    desc: "Regime automotivo, observado o art. 310 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "6",
    desc: "Regime automotivo, observado o art. 311 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "7",
    desc: "Aquisição por contribuinte na Zona Franca de Manaus, observado o art. 444 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "8",
    desc: "Aquisição por contribuinte na Zona Franca de Manaus, observado o art. 447 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "9",
    desc: "Aquisição por contribuinte na Zona Franca de Manaus, observado o art. 447 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "10",
    desc: "Aquisição por contribuinte na Zona Franca de Manaus, observado o art. 450 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "11",
    desc: "Aquisição por contribuinte na Área de Livre Comércio, observado o art. 462 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "12",
    desc: "Aquisição por contribuinte na Área de Livre Comércio, observado o art. 465 da Lei Complementar nº 214, de 2025."
  },
  {
    code: "13",
    desc: "Aquisição pela indústria na Área de Livre Comércio, observado o art. 467 da Lei Complementar nº 214, de 2025."
  }

]
  },

  // =========================
  // 🟣 CTe
  // =========================
  CTe: {
    campos: [],

    cst: [
      "000",
      "200_40",
      "410"
    ],

   classTrib: [

  {
    code: "000001",
    desc: "Situações tributadas integralmente pelo IBS e CBS."
  },

  {
    code: "200050",
    desc: "Serviços de transporte aéreo regional coletivo de passageiros ou de carga, observado o art. 287 da Lei Complementar nº 214, de 2025."
  },

  {
    code: "410001",
    desc: "Fornecimento de bonificações quando constem do respectivo documento fiscal e que não dependam de evento posterior, observado o art. 5º da Lei Complementar nº 214, de 2025."
  },

  {
    code: "410003",
    desc: "Doações que não tenham por objeto bens ou serviços que tenham permitido a apropriação de créditos pelo doador, observado o art. 6º da Lei Complementar nº 214, de 2025."
  },

  {
    code: "410004",
    desc: "Exportações de bens e serviços, observado o art. 8º da Lei Complementar nº 214, de 2025."
  },

  {
    code: "410015",
    desc: "Fornecimento por transportador autônomo não contribuinte, observado o art. 169 da Lei Complementar nº 214, de 2025."
  },

  {
    code: "410026",
    desc: "Doações sem contraprestação em benefício do doador, com anulação de crédito apropriado pelo doador referente ao fornecimento doado, observado o art. 6º da Lei Complementar nº 214, de 2025."
  },

  {
    code: "410027",
    desc: "Exportação de serviço ou de bem imaterial."
  },

  {
    code: "410999",
    desc: "Operações não onerosas sem previsão de tributação, não especificadas anteriormente, observado o art. 4º da Lei Complementar nº 214, de 2025."
  }

]
,

    creditoPresumido: []
  },

  // =========================
  // 🟡 CTeOS
  // =========================
  CTeOS: {
    campos: [],

    cst: [
      "000",
      "410"
    ],

   classTrib: [

  {
    code: "000001",
    desc: "Situações tributadas integralmente pelo IBS e CBS."
  },

  {
    code: "410001",
    desc: "Fornecimento de bonificações quando constem do respectivo documento fiscal e que não dependam de evento posterior, observado o art. 5º da Lei Complementar nº 214, de 2025."
  },

  {
    code: "410003",
    desc: "Doações que não tenham por objeto bens ou serviços que tenham permitido a apropriação de créditos pelo doador, observado o art. 6º da Lei Complementar nº 214, de 2025."
  },

  {
    code: "410004",
    desc: "Exportações de bens e serviços, observado o art. 8º da Lei Complementar nº 214, de 2025."
  },

  {
    code: "410026",
    desc: "Doações sem contraprestação em benefício do doador, com anulação de crédito apropriado pelo doador referente ao fornecimento doado, observado o art. 6º da Lei Complementar nº 214, de 2025."
  },

  {
    code: "410027",
    desc: "Exportação de serviço ou de bem imaterial."
  },

  {
    code: "410999",
    desc: "Operações não onerosas sem previsão de tributação, não especificadas anteriormente, observado o art. 4º da Lei Complementar nº 214, de 2025."
  }

]
,

    creditoPresumido: []
  },

  // =========================
  // 🟠 NFSe
  // =========================
  NFSe: {
    especial: true
  }

};
