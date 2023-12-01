import { Unit } from "../types";

/**
 * Keys are common name/short name
 */
const areas: Record<string, Unit> = {
  ac: {
    name: "acre",
    value: 1,
    selectableAs: "acres",
    default: true,
  },
  ha: {
    name: "hectare",
    value: 2.4710562857,
    selectableAs: "hectare",
  },
};

export default areas;
