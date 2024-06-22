const CurrentCSG = {
  salaries: {
    tauxPlein: {
      id: "tx_sal_CSG",
      value: 0.092,
      tauxDeductible: {
        id: "txd_sal_CSG",
        value: 0.068,
      },
    },
    abattement: {
      fraisPro: {
        id: "abat_sal_CSG",
        value: 0.0175,
      },
    },
  },
  retraites: {
    tauxPlein: {
      id: "tx_ret_CSG",
      value: 0.083,
      tauxDeductible: {
        id: "txd_ret_CSG",
        value: 0.042,
      },
    },
    seuil: {
      taux: {
        reduit: {
          celibataire: {
            id: "plaf_txred_celib",
            value: 13_960 / 12,
          },
          couple: {
            id: "plaf_txred_couple",
            value: 21_400 / 12,
          },
          demiPartSupplentaire: {
            id: "plaf_txred_demip",
            value: 3726 / 12,
          },
          entierementDeductible: {
            id: "txred_CSG",
            value: 0.038,
          },
        },
      },
      exoneration: {
        celibataire: {
          id: "plaf_exo_celib",
          value: 10_680 / 12,
        },
        couple: {
          id: "plaf_exo_couple",
          value: 16_380 / 12,
        },
        demiPartSupplentaire: {
          id: "plaf_exo_demip",
          value: 2850 / 12,
        },
      },
    },
  },
  chomage: {
    tauxPlein: {
      id: "tx_chom_CSG",
      value: 0.062,
      tauxDeductible: {
        id: "Dont_taux_déductible",
        value: 0.038,
      },
    },
    plafond: {
      tauxReduit: {
        celibataire: {
          id: "plaf_txred_celib_chom",
          value: 14_375 / 12,
        },
        parQuartSupplementaire: {
          id: "plaf_txred_part_chom",
          value: 1919 / 12,
        },
      },
    },
    seuil: {
      exoneration: {
        celibataire: {
          id: "seuil_exo_cho_celib",
          value: 10_996 / 12,
        },
        parQuartSupplementaire: {
          id: "seuil_exo_cho_demip",
          value: 1468 / 12,
        },
      },
    },
  },
};

export default CurrentCSG;
