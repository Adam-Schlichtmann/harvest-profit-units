export type Unit = {
  /**
   * aliases = other names for unit (tonnes and metric tons for example). Plural versions of these are also added
   */
  aliases?: string[];
  /**
   * name = full name of unit. A plural version of this is also added
   */
  name: string;
  /**
   * value = conversion number. If liters have a value of 1, then milliliters have a value of 0.001 (there is 0.001 liters in 1 milliliter)
   */
  value: number;
  /**
   * selectableAs = the name that shows up in the list of units that we want to be able to select from. Not every unit should go on here, just the common ones
   */
  selectableAs: string;
  default?: boolean;
};

export type InflatedUnit = {
  group: string;
  value: number;
  primaryName: string;
  fullName: string;
};

export type Product = {
  density?: number;
  liquid?: boolean;
  multiplier: number;
  price: number;
  units: string;
};

export type LineItem = {
  units: string;
  applied_acres: number | string;
  amount: number;
  is_total?: boolean;
  applied_acres_units?: string;
};
