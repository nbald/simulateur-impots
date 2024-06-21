function _salaireMensuelBrutDuLoyer(sal_net) {
    return (sal_net < 15000) * (1 / 0.8) * sal_net + (15000 <= sal_net) * (sal_net < 30000) * (1 / 0.85) * sal_net + (sal_net >= 30000) * (1 / 0.9) * sal_net
}

function _nombreDePartsFiscales(couple, nbenf) {
  let nbPartsFiscales = 1 + couple + nbenf * 0.5;

  nbPartsFiscales += (nbenf > 2) ? ( nbenf-2 ) * 0.5 : 0;
  nbPartsFiscales += (couple === 0 && nbenf > 0) ? 0.5 : 0;

  return nbPartsFiscales
}

function UserParams(net, retraite, chomage, couple, nbEnfants) {
    return {
        "salaire": {
            "net": {
                "id": "sal_net",
                "value": net
            },
            "brut": {
                "id": "sal_brut",
                "value": _salaireMensuelBrutDuLoyer(net)
            }
        },
        "retraite": {
            "id": "ret",
            "value": retraite
        },
        "chomage": {
            "id": "alloc_cho",
            "value": chomage
        },
        "couple": {
            "id": "couple",
            "value": couple
        },
        "nbEnfants": {
            "id": "nbenf",
            "value": nbEnfants
        },
        "nbPartsFiscales": {
            "id": "nbparts",
            "value": _nombreDePartsFiscales(couple, nbEnfants)
        }
    }
}

export default UserParams;
