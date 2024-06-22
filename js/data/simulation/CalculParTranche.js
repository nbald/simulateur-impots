function CalculParTranche(impot, tranches) {
  const series = [];
  let total = 0;

  for (const tranche of tranches) {
    if (impot > tranche.min) {
      const margeHaute = impot > tranche.max ? tranche.max : impot;
      const montantAImposer = margeHaute - tranche.min;
      const sommeAPayerSurTranche = montantAImposer * tranche.tauxMax;

      const serie = {
        id: tranche.name,
        value: sommeAPayerSurTranche,
      };
      series.push(serie);

      total += sommeAPayerSurTranche;
    } else {
      break;
    }
  }

  return { total };
}

export default CalculParTranche;
