import { Unit } from "../types";

const solid: Record<string, Unit> = {
  g: {
    name: "gram",
    value: 1,
    selectableAs: "grams",
  },
  mg: {
    name: "milligram",
    value: 0.001,
    selectableAs: "milligram",
  },
  kg: {
    name: "kilogram",
    value: 1000,
    selectableAs: "kilograms",
  },
  t: {
    name: "metric ton",
    aliases: ["tonne"],
    value: 1000000,
    selectableAs: "metric tons",
  },
  ton: {
    name: "ton",
    value: 907184.74,
    selectableAs: "tons",
  },
  oz: {
    name: "ounce",
    value: 28.349523125,
    selectableAs: "oz",
  },
  lbs: {
    name: "pound",
    aliases: ["lb"],
    value: 453.592375,
    selectableAs: "lbs",
    default: true,
  },
};

export default solid;
