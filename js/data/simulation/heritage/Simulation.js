// All CONSTANTS currency amounts are in cents
const CONSTANTS = {
  current: {
    NON_CHILDREN_RATE: 0.6,
    TAX_ALLOWANCE_FOR_CHILDREN: 10_000_000,
    TAX_ALLOWANCE_FOR_NON_CHILDREN: 159_400,
    SLICES: [
      { amount: 0, rate: 5 / 100 },
      { amount: 807_200, rate: 10 / 100 },
      { amount: 1_210_900, rate: 15 / 100 },
      { amount: 1_593_200, rate: 20 / 100 },
      { amount: 55_232_400, rate: 30 / 100 },
      { amount: 90_283_800, rate: 40 / 100 },
      { amount: 180_567_700, rate: 45 / 100 },
    ],
  },
  next: {
    MAX_HERITAGE_PER_HEIR: 1_200_000_000,
    TAX_ALLOWANCE: 12_000_000,
    SLICES: [
      { amount: 0, rate: 2.5 / 100 },
      { amount: 8_000_000, rate: 6.5 / 100 },
      { amount: 12_620_000, rate: 9 / 100 },
      { amount: 18_000_000, rate: 24 / 100 },
      { amount: 22_880_000, rate: 30 / 100 },
      { amount: 32_900_000, rate: 36.2 / 100 },
      { amount: 42_960_000, rate: 40 / 100 },
      { amount: 67_480_000, rate: 47 / 100 },
      { amount: 90_283_800, rate: 54 / 100 },
      { amount: 126_600_000, rate: 62 / 100 },
      { amount: 163_000_000, rate: 69 / 100 },
      { amount: 234_000_000, rate: 76 / 100 },
      { amount: 292_500_000, rate: 80 / 100 },
      { amount: 409_500_000, rate: 85 / 100 },
      { amount: 526_500_000, rate: 90 / 100 },
      { amount: 1_053_000_000, rate: 95 / 100 },
    ],
  },
};

const getCurrent = (
  patrimony = 0,
  heirs = 1,
  isSingle = true,
  toChildren = true
) => {
  const {
    SLICES,
    TAX_ALLOWANCE_FOR_CHILDREN,
    TAX_ALLOWANCE_FOR_NON_CHILDREN,
    NON_CHILDREN_RATE,
  } = CONSTANTS.current;

  const parents = isSingle ? 1 : 2;
  const multiplier = heirs * parents;

  if (!toChildren) {
    const perParentandHeirPatrimony =
      (patrimony - multiplier * TAX_ALLOWANCE_FOR_NON_CHILDREN) / multiplier;
    const perParentandHeirTaxes = perParentandHeirPatrimony * NON_CHILDREN_RATE;

    const taxes = Math.max(0, perParentandHeirTaxes * multiplier);
    const heritage = patrimony - taxes;

    return [heritage, taxes];
  }

  const perParentandHeirPatrimony =
    (patrimony - multiplier * TAX_ALLOWANCE_FOR_CHILDREN) / multiplier;

  const perParentandHeirTaxes = SLICES.reduce((total, slice, i) => {
    const nextSlice = SLICES[i + 1];
    const max = nextSlice ? nextSlice.amount - slice.amount : Infinity;
    const sliceAmount =
      slice.rate *
      Math.max(0, Math.min(perParentandHeirPatrimony - slice.amount, max));
    return total + sliceAmount;
  }, 0);

  const taxes = perParentandHeirTaxes * multiplier;
  const heritage = patrimony - taxes;

  return [heritage, taxes];
};

const getNext = (patrimony = 0, heirs = 1, isSingle = true) => {
  const { SLICES, TAX_ALLOWANCE, MAX_HERITAGE_PER_HEIR } = CONSTANTS.next;

  const parents = isSingle ? 1 : 2;
  const multiplier = heirs * parents;

  const perParentandHeirPatrimony =
    (patrimony - multiplier * TAX_ALLOWANCE) / multiplier;

  const perParentandHeirTaxes = SLICES.reduce((total, slice, i) => {
    const nextSlice = SLICES[i + 1];
    const max = nextSlice ? nextSlice.amount - slice.amount : Infinity;
    const sliceAmount =
      slice.rate *
      Math.max(0, Math.min(perParentandHeirPatrimony - slice.amount, max));
    return total + sliceAmount;
  }, 0);

  let taxes = perParentandHeirTaxes * multiplier;

  let heritage = patrimony - taxes;
  const maxPatrimony = MAX_HERITAGE_PER_HEIR * heirs;
  const maxedOutTaxes = heritage >= maxPatrimony;

  if (maxedOutTaxes) {
    taxes += heritage - maxPatrimony;
    heritage = maxPatrimony;
  }

  return [heritage, taxes, maxedOutTaxes];
};

/**
 * Method to simulate the heritage change from the current law to the AEC2022 proposition
 * @param  {number=0} patrimony The simulation base patrimony, in euros
 * @param {number=1} heirs The number of heirs
 * @param {boolean=false} isSingle Whether the person is single or in a couple (marriage/PACS)
 * @param {boolean=true} toChildren Whether the heirs are the person's children or not
 * @return {object}
 * @property {number} currentHeritage  The current law inherited amount after taxes, in euros
 * @property {number} currentTaxes The current law inherited taxes, in euros
 * @property {number} nextHeritage  The AEC propsed law inherit amount after taxes, in euros
 * @property {number} nextTaxes  The AEC propsed law inherit taxes, in euros
 * @property {boolean} maxedOutTaxes  Whether the patrimony has maxed out or not
 */
const simulate = (
  patrimony = 0,
  heirs = 1,
  isSingle = false,
  toChildren = true
) => {
  // Transform currency amounts in cents
  let patrimonyAmount = parseFloat(patrimony);
  patrimonyAmount = isNaN(patrimonyAmount)
    ? 0
    : Math.round(patrimonyAmount * 100);

  heirs = parseInt(heirs);
  heirs = isNaN(heirs) ? 1 : Math.max(1, heirs);

  const [currentHeritage, currentTaxes] = getCurrent(
    patrimonyAmount,
    heirs,
    isSingle,
    toChildren
  );
  const [nextHeritage, nextTaxes, maxedOutTaxes] = getNext(
    patrimonyAmount,
    heirs,
    isSingle,
    toChildren
  );

  const result = {
    // Transform currency amounts back in euros
    currentHeritage: Math.round(currentHeritage) / 100,
    currentTaxes: Math.round(currentTaxes) / 100,
    nextHeritage: Math.round(nextHeritage) / 100,
    nextTaxes: Math.round(nextTaxes) / 100,
    maxedOutTaxes,
  };
  console.debug("Params", {
    patrimony,
    heirs,
    isSingle,
    toChildren,
  });
  console.debug("Result", result);
  return result;
};

export default simulate;
