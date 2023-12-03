import { Unit } from "../types";

/**
 * Keys are common name/short name
 */
const seed: Record<string, Unit> = {
  seed: {
    name: "seed",
    value: 1,
    selectableAs: "seeds",
    default: true,
  },
  bag: {
    name: "bag",
    value: 80000,
    selectableAs: "bags",
  },
  "units - 130k": {
    name: "units - 130k",
    aliases: ["unit130k", "unit - 130k", "units130k"],
    value: 130000,
    selectableAs: "units - 130k",
  },
  "units - 140k": {
    name: "units - 140k",
    aliases: ["unit140k", "unit - 140k", "units140k"],
    value: 140000,
    selectableAs: "units - 140k",
  },
};

export default seed;
