import CurrentCSG from './../legislative_parameters/CurrentCSG'
import CurrentIR from './../legislative_parameters/CurrentIR'

function _csg_taux_plein_et_CRDS(sal_net, sal_brut, ret, alloc_cho, couple, nbparts) {
    var result = {
        "salarie": 0,
        "retraite": 0,
        "chomeur": 0
    }

    var tx_sal_CSG = CurrentCSG.salaries.tauxPlein.value

    var tx_ret_CSG = CurrentCSG.retraites.tauxPlein.value
    var plaf_txred_celib = CurrentCSG.retraites.seuil.taux.reduit.celibataire.value
    var plaf_exo_demip = CurrentCSG.retraites.seuil.exoneration.demiPartSupplentaire.value

    var plaf_txred_celib_chom = CurrentCSG.chomage.plafond.tauxReduit.celibataire.value
    var plaf_txred_part_chom = CurrentCSG.chomage.plafond.tauxReduit.parQuartSupplementaire.value
    var tx_chom_CSG = CurrentCSG.chomage.tauxPlein.value
    var plaf_abatchom = CurrentIR.plafond.abattement.chomage.value
    var abat_sal_CSG = CurrentCSG.salaries.abattement.fraisPro.value

    result.salarie = (tx_sal_CSG + 0.005) * sal_brut * 0.9825

    var revenusTotaux = sal_net + ret + alloc_cho

    if (revenusTotaux > (plaf_txred_celib + plaf_exo_demip * nbparts * 2)) {
        result.retraite = (tx_ret_CSG + 0.005) * ret
    }

    if (revenusTotaux > plaf_txred_celib_chom + plaf_txred_part_chom * nbparts * 4) {
        result.chomeur = (tx_chom_CSG + 0.005) * alloc_cho * (1 - (alloc_cho < plaf_abatchom) * abat_sal_CSG)
    }

    return result
}

function _csg_taux_reduit_et_CRDS(sal_net, sal_brut, ret, alloc_cho, couple, nbparts, csg_taux_plein_chomeur) {
    var result = {
        "salarie": 0,
        "retraite": 0,
        "chomeur": 0
    }

    var revenusTotaux = sal_net + ret + alloc_cho

    var plaf_exo_demip = CurrentCSG.retraites.seuil.exoneration.demiPartSupplentaire.value
    var plaf_txred_celib = CurrentCSG.retraites.seuil.taux.reduit.celibataire.value

    var txred_CSG = CurrentCSG.retraites.seuil.taux.reduit.entierementDeductible.value

    var seuil_exo_cho_celib = CurrentCSG.chomage.seuil.exoneration.celibataire.value
    var seuil_exo_cho_demip = CurrentCSG.chomage.seuil.exoneration.parQuartSupplementaire.value
    var plaf_abatchom = CurrentIR.plafond.abattement.chomage.value
    var abat_sal_CSG = CurrentCSG.salaries.abattement.fraisPro.value

    if (revenusTotaux <= plaf_txred_celib + plaf_exo_demip * nbparts * 2) {
        result.retraite = (txred_CSG + 0.005) * ret
    }

    if (csg_taux_plein_chomeur <= 0) {
        if (revenusTotaux > (seuil_exo_cho_celib + seuil_exo_cho_demip * nbparts * 4)) {
            result.chomeur = (txred_CSG + 0.005) * alloc_cho * (1 - (alloc_cho < plaf_abatchom) * abat_sal_CSG)
        }
    }

    return result
}

function _csg_deductible(sal_net, sal_brut, ret, alloc_cho, couple, nbparts, csg_taux_reduit_retraite, csg_taux_plein_chomeur) {
    var result = {
        "salarie": 0,
        "retraite": 0,
        "chomeur": 0
    }

    var txd_sal_CSG = CurrentCSG.salaries.tauxPlein.tauxDeductible.value
    result.salarie = txd_sal_CSG * sal_brut * 0.9825

    var txd_ret_CSG = CurrentCSG.retraites.tauxPlein.tauxDeductible.value
    result.retraite = csg_taux_reduit_retraite > 0
        ? csg_taux_reduit_retraite
        : txd_ret_CSG * ret

    var txred_CSG = CurrentCSG.retraites.seuil.taux.reduit.entierementDeductible.value
    var plaf_abatchom = CurrentIR.plafond.abattement.chomage.value
    var abat_sal_CSG = CurrentCSG.salaries.abattement.fraisPro.value

    if (alloc_cho + csg_taux_plein_chomeur > 0) {
        result.chomeur = txred_CSG * alloc_cho * (1 - (alloc_cho < plaf_abatchom) * abat_sal_CSG)
    }

    return result
}

function _revenu_declare(sal_net, ret, alloc_cho, csgTauxPlein, csgTauxReduit, csgDeductible) {
    return {
        "salarie": sal_net + csgTauxPlein.salarie - csgDeductible.salarie,
        "retraite": ret + (csgTauxPlein.retraite + csgTauxReduit.retraite) - csgDeductible.retraite,
        "chomeur": alloc_cho+(csgTauxPlein.chomeur + csgTauxReduit.chomeur)-csgDeductible.chomeur
    }
}

function _revenu_fiscal_de_reference(revenu_declare) {
    var result = {
        "salarie": 0,
        "retraite": 0,
        "chomeur": 0
    }

    // Salarié

    var planch_abatpro = CurrentIR.plancher.abattement.fraisPro.value
    var abat_pro_ret = CurrentIR.abattement.fraisProEtRetraites.value
    var plaf_abatpro = CurrentIR.plafond.abattement.fraisPro.value

    var valeurMin = 0
    var revenuDeclare = revenu_declare.salarie
    
    var maxCalcul = Math.max(planch_abatpro, abat_pro_ret * revenuDeclare)
    var minCalcul = Math.min(maxCalcul, plaf_abatpro)

    result.salarie  = Math.max(valeurMin, revenuDeclare - minCalcul)

    // Retraité
    revenuDeclare = revenu_declare.retraite

    var planch_abatret = CurrentIR.plancher.abattement.retraites.value
    var plaf_abatret = CurrentIR.plafond.abattement.retraites.value

    maxCalcul = Math.max(planch_abatret, abat_pro_ret * revenuDeclare)
    minCalcul = Math.min(maxCalcul, plaf_abatret)

    result.retraite  = Math.max(valeurMin, revenuDeclare - minCalcul)

    // Chômeur
    revenuDeclare = revenu_declare.chomeur

    var planch_abatchom = CurrentIR.plancher.abattement.chomage.value

    maxCalcul = Math.max(planch_abatchom, abat_pro_ret * revenuDeclare)
    minCalcul = Math.min(maxCalcul, plaf_abatpro)

    result.chomeur  = Math.max(valeurMin, revenuDeclare - minCalcul)

    return result

}

function IRParams(userParams) {
    var salaireNet = userParams.salaire.net.value
    var salaireBrut = userParams.salaire.brut.value
    var retraite = userParams.retraite.value
    var chomage = userParams.chomage.value
    var couple = userParams.couple.value
    var nbParts = userParams.nbPartsFiscales.value

    var csgTauxPlein = _csg_taux_plein_et_CRDS(salaireNet, salaireBrut, retraite, chomage, couple, nbParts)

    var csgTauxReduit = _csg_taux_reduit_et_CRDS(salaireNet, salaireBrut, retraite, chomage, couple, nbParts, csgTauxPlein.chomeur)

    var csgDeductible = _csg_deductible(salaireNet, salaireBrut, retraite, chomage, couple, nbParts, csgTauxReduit.retraite, csgTauxPlein.chomeur)

    var revenuDeclare = _revenu_declare(salaireNet, retraite, chomage, csgTauxPlein, csgTauxReduit, csgDeductible)

    var revenuFiscalDeReference = _revenu_fiscal_de_reference(revenuDeclare)

    return {
        "csg": {
            "taux": {
                "plein": csgTauxPlein,
                "reduit": csgTauxReduit
            },
            "deductible": csgDeductible
        },
        "revenu": {
            "declare": revenuDeclare,
            "fiscalDeReference": revenuFiscalDeReference
        }
    }
}

export default IRParams;
