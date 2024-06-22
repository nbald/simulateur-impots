import NewIR from "./../legislative_parameters/NewIR";
import NewCSG from "./../legislative_parameters/NewCSG";
import CurrentIR from "./../legislative_parameters/CurrentIR";
import CalculParTranche from "./CalculParTranche";

function RevenusImposableIndividuel(revenuNet, revenuBrut) {
  const abattement = 0.9825;
  const csgDeductibleJLM = 0.74;

  // Taux CSG JLM
  const c26 = revenuBrut * abattement;

  // CSG JLM
  const calculCSG = CalculParTranche(c26, NewCSG.bareme);
  const d26 = calculCSG.total + 0.005 * c26;

  /*IF(B26×(Paramètres législatifs::Table 1::$B$18)≤Paramètres législatifs::Table 1::$B$20;B26×(1−Paramètres législatifs::Table 1::$B$18);B26−Paramètres législatifs::Table 1::$B$20)−D26×Paramètres législatifs::Table 1::$A$23*/
  // Revenu imposable par part fiscale
  let e26 = 0;
  e26 =
    revenuNet * CurrentIR.abattement.fraisProEtRetraites.value <=
    CurrentIR.plafond.abattement.fraisPro.value
      ? revenuNet * (1 - CurrentIR.abattement.fraisProEtRetraites.value)
      : revenuNet - CurrentIR.plafond.abattement.fraisPro.value;

  e26 -= d26 * csgDeductibleJLM;

  // Impôt *par part fiscale* avant CI QF
  const calculIR = CalculParTranche(e26, NewIR.bareme);
  const f26 = calculIR.total;

  return {
    csg: d26,
    ir: f26,
  };
}

// expected parameters :
// salaires.person1 -> si célibataire, ou personne 1 si en couple
// salaires.person2 -> personne 2 si en couple

function JLMSimulation(salaires, couple, nbenf, salaireBrut) {
  const ci_enfant = NewIR.creditImpotEnfant;
  const ci_2emeEnfant = NewIR.creditImpot2emeEnfant;

  let person2 = {
    csg: 0,
    ir: 0,
  };

  // Personne 1 : Impôt par part fiscale avant CI QF
  const person1 = RevenusImposableIndividuel(
    salaires.person1,
    salaireBrut.person1
  );
  // Personne 2 : Impôt par part fiscale avant CI QF
  if (couple === 1) {
    person2 = RevenusImposableIndividuel(salaires.person2, salaireBrut.person2);
  }
  const f26 = person1.ir;
  const f27 = person2.ir;

  // Impôt total couple
  const g26 = f26 + f27;

  // IR après crédit enfant
  //G26−(Paramètres législatifs::Table 1::$E$16×(IF($B$3≤2;$B$3;2)))−Paramètres législatifs::Table 1::$E$17×(IF($B$3>2;$B$3−2;0))
  let creditEnfants = 0;
  for (let index = 0; index < nbenf; index++) {
    if (index < 2) creditEnfants += ci_enfant;
    if (index >= 2) creditEnfants += ci_2emeEnfant;
  }
  const h26 = g26 - creditEnfants;

  // CSG due
  const i26 = person1.csg + person2.csg;

  return {
    ir: h26,
    csg: i26,
  };
}

export default JLMSimulation;
