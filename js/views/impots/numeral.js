import numeral from "numeral";

numeral.register("locale", "fr", {
  delimiters: {
    thousands: "\u00a0",
    decimal: ",",
  },
});
numeral.locale("fr");

export const prettyNumber = (number) =>
  number === "" ? "" : numeral(number).format("€0,0");

export default numeral;
