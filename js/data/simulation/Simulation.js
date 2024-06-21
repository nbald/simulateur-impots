import CurrentIR from './../legislative_parameters/CurrentIR'
import CalculParTranche from './CalculParTranche'
import CurrentCSG from './../legislative_parameters/CurrentCSG'

function CalculSalaireBrut(d8) {
    if (d8 < 9000) return d8*1.27
    if (d8 >= 9000 && d8 < 30000) return d8*1.25
    if (d8 >= 30000 && d8 < 50000) return d8*1.2
    if (d8 >= 50000 && d8 < 500000) return d8*1.15
    if (d8 >= 500000) return d8*1.1
}

function Simulation(salaireNet1, salaireNet2, nbEnfants, couple) {
    var b2 = couple
    var b3 = nbEnfants;
    var d2 = salaireNet1
    var d3 = (couple === 1 ? salaireNet2 : 0)
    var m14 = Math.max(salaireNet1, salaireNet2)
    var m15 = Math.min(salaireNet1, salaireNet2)

    // Salaire net foyer
    var d8 = salaireNet1 + (couple === 1 ? salaireNet2 : 0)


    // Salaire Brut Personne 1
    var b8 = CalculSalaireBrut(d2)
    // Salaire Brut Personne 2 
    var b9 = CalculSalaireBrut(d3)
    
    // Salaire brut foyer
    var b7 = b8 + b9 // CalculSalaireBrut(d8)

    // Nb parts enfants
    var d10 = 0 
    if (couple === 1) {
        d10 = (b3>0 ? (b3<=2 ? b3*0.5 : 0) + (b3>=3 ? 1+(b3-2)*1 : 0): 0)
    } else {
        if (nbEnfants === 1) {
            d10 = 1
        } else if(nbEnfants == 2) {
            d10 = 1.5
        } else if (nbEnfants > 2) {
            d10 = (nbEnfants-2) + 1.5
        }
    }

    // Nombre de parts fiscales
    var d7 = 1 + b2 + d10

    /////////
    // Construction du revenu imposable 

    // CSG Taux Plein et CRDS...
    //... pour le Foyer
    var b15 = (CurrentCSG.salaries.tauxPlein.value +0.005) * b7 * 0.9825
    // ... pour la Personne1
    var b16 = (CurrentCSG.salaries.tauxPlein.value +0.005) * b8 * 0.9825
    // ... pour la Personne2 
    var b17 = (CurrentCSG.salaries.tauxPlein.value +0.005) * b9 * 0.9825

    // CSG déductible...
    //... pour le Foyer
    var c15 = CurrentCSG.salaries.tauxPlein.tauxDeductible.value * b7 * 0.9825
    // ... pour la Personne1
    var c16 = CurrentCSG.salaries.tauxPlein.tauxDeductible.value * b8 * 0.9825
    // ... pour la Personne2 
    var c17 = CurrentCSG.salaries.tauxPlein.tauxDeductible.value * b9 * 0.9825

    // Revenu déclaré...
    //... pour le Foyer
    var d15 = d8
    // ... pour la Personne1
    var d16 = d8
    // ... pour la Personne2 
    var d17 = d3

    // RFR (Revenu Fiscal de Référence)
    //... pour le Foyer
    var e15 = Math.max(0,d15-Math.min(Math.max(CurrentIR.plancher.abattement.fraisPro.value,CurrentIR.abattement.fraisProEtRetraites.value * d15),CurrentIR.plafond.abattement.fraisPro.value))
    // ... pour la Personne1
    var e16 = Math.max(0,d16-Math.min(Math.max(CurrentIR.plancher.abattement.fraisPro.value,CurrentIR.abattement.fraisProEtRetraites.value * d16),CurrentIR.plafond.abattement.fraisPro.value))
    // ... pour la Personne2 
    var e17 = Math.max(0,d17-Math.min(Math.max(CurrentIR.plancher.abattement.fraisPro.value,CurrentIR.abattement.fraisProEtRetraites.value * d17),CurrentIR.plafond.abattement.fraisPro.value))

    // Revenu imposable par part fiscale
    var a22 = e15 / d7

    // Revenu imposable par part fiscale sans QF
    var b22 = e15/(d7-d10)

    /* Calcul intermédiaire IR */

    // Taux
    var j48 = 0.11
    var j49 = 0.3
    var j50 = 0.41 
    var j51 = 0.45

    // Tranche
    var k47 = 852
    var k48 = 2172
    var k49 = 6212
    var k50 = 13361
    var k51 = Number.MAX_SAFE_INTEGER

    var l48 = (k48-k47)*j48
    var l49 = (k49-k48)*j49
    var l50 = (k50-k49)*j50
    var l51 = Number.MAX_SAFE_INTEGER

    var h48 = (k48 <= a22 ? l48 : (a22-k47)*j48)
    var h49 = (k49 <= a22 ? l49 : (a22-k48)*j49)
    var h50 = (k50 <= a22 ? l50 : (a22-k49)*j50)
    var h51 = (k51 <= a22 ? l51 : (a22-k50)*j51)

    var i48 = (k48 <= b22 ? l48 : (b22-k47)*j48)
    var i49 = (k49 <= b22 ? l49 : (b22-k48)*j49)
    var i50 = (k50 <= b22 ? l50 : (b22-k49)*j50)
    var i51 = (b22-k50)*j51

    var arrayForPerson1 = [h48, h49, h50, h51]
    
    // Impôt avant décote avec QF par part fiscale
    var c22 = 0
    for (let index = 0; index < arrayForPerson1.length; index++) {
        const element = arrayForPerson1[index];
        if (element > 0) {
            c22 += element
        }
    }

    var arrayForPerson2 = [i48, i49, i50, i51]
    
    // Impôt avant décote sans QF par part fiscale
    var d22 = 0

    for (let index = 0; index < arrayForPerson2.length; index++) {
        const element = arrayForPerson2[index];
        if (element > 0) {
            d22 += element
        }
    }

    var plafond_qf_celib = 1852/12
    var g16 = ((d22-c22)/(d10/0.5))>plafond_qf_celib ? ((d22-c22)/(d10*2)-plafond_qf_celib)*d10*2 : 0
    var g17 =  ((d22-c22)/(d10/0.5))>CurrentIR.plafond.qf.parDemiPart.value ? ((d22-c22)/(d10*2)-CurrentIR.plafond.qf.parDemiPart.value)*d10*2 : 0
    
    var l18 = c22 * d7

    /*
    var m18 = d22 * (d7 - d10 )
    if (couple === 0) {
        m18 -= 1852/12
    } else {
        m18 -= 1286/12
    }
    m18 = m18 * d10 * 2
*/
    var plaf_qf = (couple === 0 ? 1852/12 : 1527/12)

    var m18 = d22 * (d7 - d10) - plaf_qf*d10*2
    var n19 = 0
    if (l18 < m18) {
        n19 = m18
    } else {
        n19 = l18
    }

    // Impôt total avant décote avec plafonnement du QF 
    var f22 = n19

    //Décote
    var g22 = (b2===0 ? 
        (f22<CurrentIR.plafond.decote.celibataire.value ? CurrentIR.plafond.decote.celibataire.value2 -CurrentIR.tauxDecote.value*f22 : 0) : 
        (f22<CurrentIR.plafond.decote.couple.value ? CurrentIR.plafond.decote.couple.value2-CurrentIR.tauxDecote.value*f22 : 0))

    // Impôt dû (après décote et seuil de recouvrement)
    //IF(F22−G22≥Paramètres législatifs::Table 1::$B$25;F22−G22;0)
    var h22 = (f22-g22)>=0 ? f22 - g22 : 0

    // CSG due
    var i22 = b15

    // Total dû
    var j22 = i22 + h22

    var result = {
        "impot": {
            "du": {
                "value": h22
            }
        },
        "csg": {
            "du": {
                "value": i22
            }
        },
        "total": {
            "du": {
                "value": j22
            }
        },
        "salaireBrut": {
            "foyer": b7,
            "person1": b8,
            "person2": b9
        }
    }

    return result;
}

export default Simulation;