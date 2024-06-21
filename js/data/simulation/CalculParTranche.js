function CalculParTranche(impot, tranches) {

    var series = []
    var total = 0

    for (var tranche of tranches) {
        if (impot > tranche.min) {
            var margeHaute = (impot > tranche.max)
                ? tranche.max
                : impot;
            var montantAImposer = margeHaute - tranche.min;
            var sommeAPayerSurTranche = montantAImposer * tranche.tauxMax

            var serie = {
                "id": tranche.name,
                "value": sommeAPayerSurTranche
            };
            series.push(serie);

            total += sommeAPayerSurTranche;
        } else {
            break;
        }
    }

    return { "total": total }
}

export default CalculParTranche;
