import { Unit } from "../types";

/**
 * Keys are common name/short name
 */
const liquid: Record<string, Unit> = {
  l: {
    name: "liter",
    aliases: ["litre"],
    value: 1,
    selectableAs: "liters",
  },
  ml: {
    name: "milliliter",
    value: 0.001,
    selectableAs: "milliliters",
  },
  pt: {
    name: "pint",
    value: 0.473176473,
    selectableAs: "pints",
  },
  qt: {
    name: "quart",
    value: 0.946352946,
    selectableAs: "quarts",
  },
  gal: {
    name: "gallon",
    value: 3.785411784,
    selectableAs: "gallons",
    default: true,
  },
  floz: {
    name: "fluid ounce",
    aliases: ["fl oz"],
    value: 0.02957353,
    selectableAs: "floz",
  },
};

export default liquid;
