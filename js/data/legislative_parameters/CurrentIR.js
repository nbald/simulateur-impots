const CurrentIR = {
  bareme: [
    {
      name: "0%",
      min: 0,
      max: 852,
      taux: 0,
    },
    {
      name: "11%",
      min: 852,
      max: 2172,
      taux: 0.11,
    },
    {
      name: "30%",
      min: 2172,
      max: 6212,
      taux: 0.3,
    },
    {
      name: "41%",
      min: 6212,
      max: 13_361,
      taux: 0.41,
    },
    {
      name: "45%",
      min: 13_361,
      max: Number.MAX_SAFE_INTEGER,
      taux: 0.45,
    },
  ],
  tauxDecote: {
    id: "tx_decote",
    value: 0.4525,
  },
  plafond: {
    decote: {
      celibataire: {
        id: "plaf_decote_celib",
        value: 1722 / 12,
        value2: 779 / 12,
      },
      couple: {
        id: "plaf_decote_couple",
        value: 2849 / 12,
        value2: 1286 / 12,
      },
    },
    qf: {
      parDemiPart: {
        id: "plaf_QF",
        value: 1527 / 12,
      },
    },
    abattement: {
      fraisPro: {
        id: "plaf_abatpro",
        value: 1069, //12826/12 // 1069
      },
      retraites: {
        id: "plaf_abatret",
        value: 3912 / 12, // 326
      },
      chomage: {
        id: "plaf_abatchom",
        value: 156_912 / 12, // 13076 // 13076
      },
    },
  },
  abattement: {
    fraisProEtRetraites: {
      id: "abat_pro_ret",
      value: 0.1,
    },
  },
  plancher: {
    abattement: {
      fraisPro: {
        id: "planch_abatpro",
        value: 37, //444/12 // 37
      },
      retraites: {
        id: "planch_abatret",
        value: 396 / 12, // 33
      },
      chomage: {
        id: "planch_abatchom",
        value: 936 / 12, // 78
      },
    },
  },
  seuilRecouvrement: {
    id: "seuil_recouv",
    value: 5,
  },
};

export default CurrentIR;
