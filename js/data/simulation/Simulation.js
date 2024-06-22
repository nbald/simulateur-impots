import CurrentIR from "./../legislative_parameters/CurrentIR";
import CurrentCSG from "./../legislative_parameters/CurrentCSG";

function CalculSalaireBrut(d8) {
  if (d8 < 9000) return d8 * 1.27;
  if (d8 >= 9000 && d8 < 30_000) return d8 * 1.25;
  if (d8 >= 30_000 && d8 < 50_000) return d8 * 1.2;
  if (d8 >= 50_000 && d8 < 500_000) return d8 * 1.15;
  if (d8 >= 500_000) return d8 * 1.1;
}

function Simulation(salaireNet1, salaireNet2, nbEnfants, couple) {
  const d3 = couple === 1 ? salaireNet2 : 0;
  // Salaire net foyer
  const d8 = salaireNet1 + (couple === 1 ? salaireNet2 : 0);

  // Salaire Brut Personne 1
  const b8 = CalculSalaireBrut(salaireNet1);
  // Salaire Brut Personne 2
  const b9 = CalculSalaireBrut(d3);

  // Salaire brut foyer
  const b7 = b8 + b9; // CalculSalaireBrut(d8);

  // Nb parts enfants
  let d10 = 0;
  if (couple === 1) {
    d10 =
      nbEnfants > 0
        ? (nbEnfants <= 2 ? nbEnfants * 0.5 : 0) +
          (nbEnfants >= 3 ? 1 + (nbEnfants - 2) * 1 : 0)
        : 0;
  } else if (nbEnfants === 1) {
    d10 = 1;
  } else if (nbEnfants == 2) {
    d10 = 1.5;
  } else if (nbEnfants > 2) {
    d10 = nbEnfants - 2 + 1.5;
  }

  // Nombre de parts fiscales
  const d7 = 1 + couple + d10;

  /////////
  // Construction du revenu imposable

  // CSG Taux Plein et CRDS...
  //... pour le Foyer
  const b15 = (CurrentCSG.salaries.tauxPlein.value + 0.005) * b7 * 0.9825;

  // RFR (Revenu Fiscal de Référence)
  //... pour le Foyer
  const e15 = Math.max(
    0,
    d8 -
      Math.min(
        Math.max(
          CurrentIR.plancher.abattement.fraisPro.value,
          CurrentIR.abattement.fraisProEtRetraites.value * d8
        ),
        CurrentIR.plafond.abattement.fraisPro.value
      )
  );

  // Revenu imposable par part fiscale
  const a22 = e15 / d7;

  // Revenu imposable par part fiscale sans QF
  const b22 = e15 / (d7 - d10);

  /* Calcul intermédiaire IR */

  // Taux
  const j48 = 0.11;
  const j49 = 0.3;
  const j50 = 0.41;
  const j51 = 0.45;

  // Tranche
  const k47 = 852;
  const k48 = 2172;
  const k49 = 6212;
  const k50 = 13_361;
  const k51 = Number.MAX_SAFE_INTEGER;

  const l48 = (k48 - k47) * j48;
  const l49 = (k49 - k48) * j49;
  const l50 = (k50 - k49) * j50;
  const l51 = Number.MAX_SAFE_INTEGER;

  const h48 = k48 <= a22 ? l48 : (a22 - k47) * j48;
  const h49 = k49 <= a22 ? l49 : (a22 - k48) * j49;
  const h50 = k50 <= a22 ? l50 : (a22 - k49) * j50;
  const h51 = k51 <= a22 ? l51 : (a22 - k50) * j51;

  const i48 = k48 <= b22 ? l48 : (b22 - k47) * j48;
  const i49 = k49 <= b22 ? l49 : (b22 - k48) * j49;
  const i50 = k50 <= b22 ? l50 : (b22 - k49) * j50;
  const i51 = (b22 - k50) * j51;

  const arrayForPerson1 = [h48, h49, h50, h51];

  // Impôt avant décote avec QF par part fiscale
  let c22 = 0;
  for (const element of arrayForPerson1) {
    if (element > 0) {
      c22 += element;
    }
  }

  const arrayForPerson2 = [i48, i49, i50, i51];

  // Impôt avant décote sans QF par part fiscale
  let d22 = 0;

  for (const element of arrayForPerson2) {
    if (element > 0) {
      d22 += element;
    }
  }

  const l18 = c22 * d7;

  /*
        var m18 = d22 * (d7 - d10 )
        if (couple === 0) {
            m18 -= 1852/12
        } else {
            m18 -= 1286/12
        }
        m18 = m18 * d10 * 2
    */
  const plaf_qf = couple === 0 ? 1852 / 12 : 1527 / 12;

  const m18 = d22 * (d7 - d10) - plaf_qf * d10 * 2;
  let n19 = 0;
  n19 = l18 < m18 ? m18 : l18;

  // Impôt total avant décote avec plafonnement du QF
  const f22 = n19;

  //Décote
  const g22 =
    couple === 0
      ? f22 < CurrentIR.plafond.decote.celibataire.value
        ? CurrentIR.plafond.decote.celibataire.value2 -
          CurrentIR.tauxDecote.value * f22
        : 0
      : f22 < CurrentIR.plafond.decote.couple.value
      ? CurrentIR.plafond.decote.couple.value2 -
        CurrentIR.tauxDecote.value * f22
      : 0;

  // Impôt dû (après décote et seuil de recouvrement)
  //IF(F22−G22≥Paramètres législatifs::Table 1::$B$25;F22−G22;0)
  const h22 = f22 - g22 >= 0 ? f22 - g22 : 0;

  // Total dû
  const j22 = b15 + h22;

  return {
    impot: {
      du: {
        value: h22,
      },
    },
    csg: {
      du: {
        value: b15,
      },
    },
    total: {
      du: {
        value: j22,
      },
    },
    salaireBrut: {
      foyer: b7,
      person1: b8,
      person2: b9,
    },
  };
}

export default Simulation;
