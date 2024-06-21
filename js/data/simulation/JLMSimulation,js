import NewIR from './../legislative_parameters/NewIR'
import NewCSG from './../legislative_parameters/NewCSG'
import CurrentIR from './../legislative_parameters/CurrentIR'
import CalculParTranche from './CalculParTranche'

function RevenusImposableIndividuel(revenuNet, revenuBrut) {
    var abattement = 0.9825
    var csgDeductibleJLM = 0.74

    // Revenu net JLM
    var b26 = revenuNet

    // Taux CSG JLM
    var c26 = revenuBrut * abattement

    // CSG JLM
    var calculCSG = CalculParTranche(c26, NewCSG.bareme)
    var d26 = calculCSG.total + 0.005 * c26

    /*IF(B26×(Paramètres législatifs::Table 1::$B$18)≤Paramètres législatifs::Table 1::$B$20;B26×(1−Paramètres législatifs::Table 1::$B$18);B26−Paramètres législatifs::Table 1::$B$20)−D26×Paramètres législatifs::Table 1::$A$23*/
    // Revenu imposable par part fiscale
    var e26 = 0
    if (b26 * CurrentIR.abattement.fraisProEtRetraites.value <= CurrentIR.plafond.abattement.fraisPro.value) {
        e26 = b26 * (1-CurrentIR.abattement.fraisProEtRetraites.value)
    } else {
        e26 = b26 - CurrentIR.plafond.abattement.fraisPro.value
    }

    e26 = e26 - d26 * csgDeductibleJLM

    // Impôt *par part fiscale* avant CI QF
    var calculIR = CalculParTranche(e26, NewIR.bareme)
    var f26 = calculIR.total

    var result = {
        "csg": d26,
        "ir": f26
    }
    return result
}

// expected parameters : 
// salaires.person1 -> si célibataire, ou personne 1 si en couple
// salaires.person2 -> personne 2 si en couple

function JLMSimulation(salaires, couple, nbenf, salaireBrut) {
    var ci_enfant = NewIR.creditImpotEnfant
    var ci_2emeEnfant = NewIR.creditImpot2emeEnfant
    var ci_4emeEnfant = NewIR.creditImpot4emeEnfant

    var person2 = { 
        "csg": 0,
        "ir": 0
    }
    
    // Personne 1 : Impôt par part fiscale avant CI QF
    var person1 = RevenusImposableIndividuel(salaires.person1, salaireBrut.person1)
    // Personne 2 : Impôt par part fiscale avant CI QF
    if (couple === 1) {
        person2 = RevenusImposableIndividuel(salaires.person2, salaireBrut.person2)
    }
    var f26 = person1.ir
    var f27 = person2.ir

    // Impôt total couple
    var g26 = f26 + f27

    // IR après crédit enfant
    //G26−(Paramètres législatifs::Table 1::$E$16×(IF($B$3≤2;$B$3;2)))−Paramètres législatifs::Table 1::$E$17×(IF($B$3>2;$B$3−2;0))
    var creditEnfants = 0;
    for (let index = 0; index < nbenf; index++) {
        if(index < 2) creditEnfants += ci_enfant
        if (index >= 2) creditEnfants += ci_2emeEnfant
    }
    var h26 = g26 - creditEnfants

    // CSG due
    var i26 = person1.csg + person2.csg

    return {
        "ir": h26,
        "csg": i26
    }
}

export default JLMSimulation;
