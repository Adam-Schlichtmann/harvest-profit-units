import Units from "./Units";
import { LineItem, Product } from "./types";

export const availableBushelUnits = Units.selectableUnits("yield");

export const availableSeedUnits = Units.selectableUnits("seed");

export const availableSolidUnits = Units.selectableUnits("weight");

export const availableLiquidUnits = Units.selectableUnits("liquid");

export default class UnitsHelper {
  static isCompatibleUnit = (unit1: string, unit2: string) =>
    Units.isCompatible(unit1, unit2);

  static isLiquid = (product: Product) =>
    product.liquid !== false && (product?.density ?? 0) > 0;

  static liquidToSolid = (
    liquidAmount: number,
    liquidUnitName: string,
    solidUnitName: string,
    density: number
  ) => {
    const liquidAmountInGallons = new Units(liquidAmount, liquidUnitName).to(
      "gallons"
    );
    return new Units(liquidAmountInGallons.toNumber() * density, "lbs").to(
      solidUnitName
    );
  };

  static listAvailableUnits(product: Product) {
    const primaryUnit = UnitsHelper.parseUnit(product.units);
    const unitCheck = UnitsHelper.isCompatibleUnit;
    const isLiquid = UnitsHelper.isLiquid(product);
    if (primaryUnit === "custom") {
      return [...availableSeedUnits, "custom"];
    } else if (unitCheck(primaryUnit, "bushel")) {
      return availableBushelUnits;
    } else if (unitCheck(primaryUnit, "seed")) {
      return availableSeedUnits;
    } else if (unitCheck(primaryUnit, "gallons") || isLiquid) {
      return availableLiquidUnits;
    }
    return availableSolidUnits;
  }

  static perAcreCost = (product: Product, item: LineItem, acres: number) => {
    const perUnitCost = UnitsHelper.perUnitCost(product, item);
    let acresRatio = 1;

    let itemAppliedAcres =
      typeof item.applied_acres === "string"
        ? parseFloat(item.applied_acres)
        : item.applied_acres;
    function isSplit() {
      if (item.applied_acres_units === "percent") return false;
      if (Number.isNaN(itemAppliedAcres)) return false;
      if (itemAppliedAcres === acres) return false;
      return true;
    }

    function isRatio() {
      if (item.applied_acres_units !== "percent") return false;
      if (Number.isNaN(itemAppliedAcres)) return false;
      if (itemAppliedAcres === 100) return false;
      return true;
    }

    if (isSplit()) {
      acresRatio = itemAppliedAcres / acres;
    } else if (isRatio()) {
      acresRatio = itemAppliedAcres / 100;
    }
    if (item.is_total) {
      const total = item.amount * perUnitCost;
      return total / acres;
    }
    return item.amount * perUnitCost * acresRatio;
  };

  static lineItemToProductUnits = (item: LineItem, product: Product) => {
    const productUnit = UnitsHelper.parseUnit(product.units);
    const lineItemUnit = UnitsHelper.parseUnit(item.units);

    const isProductLiquid = product.liquid && (product?.density ?? 0) > 0;

    try {
      if (productUnit === "custom") {
        const amount = lineItemUnit === "custom" ? product.multiplier : 1;
        const unit = lineItemUnit === "custom" ? "seed" : lineItemUnit;
        const lineItemInSeedUnits = new Units(amount, unit)
          .to("seeds")
          .toNumber();
        const lineIteminCustomUnits = lineItemInSeedUnits / product.multiplier;
        return lineIteminCustomUnits;
      } else if (
        isProductLiquid &&
        !UnitsHelper.isCompatibleUnit(lineItemUnit, productUnit)
      ) {
        const finalCalc = UnitsHelper.liquidToSolid(
          1,
          lineItemUnit,
          productUnit,
          product?.density ?? 0
        ).toNumber();
        if (finalCalc > 0) {
          return finalCalc;
        }
      } else {
        // If all else fails, try to convert
        const lineItemInProductUnits = new Units(1, lineItemUnit)
          .to(productUnit)
          .toNumber();
        if (lineItemInProductUnits > 0) {
          return lineItemInProductUnits;
        }
      }
    } catch (error) {
      return 1;
    }

    return 0;
  };

  static perUnitCost = (product: Product, item: LineItem) => {
    return UnitsHelper.lineItemToProductUnits(item, product) * product.price;
  };

  static toProductUnits = (item: LineItem, product: Product) => {
    return UnitsHelper.lineItemToProductUnits(item, product) * item.amount;
  };

  static parseUnit = (unit: string) => unit.replace("per ", "");

  static parseOldUnit = (unit: string) => unit;

  static convertToUnit(amount: number, fromUnit: string, toUnit: string) {
    const parsedFromUnit = this.parseUnit(fromUnit);
    const parsedToUnit = this.parseUnit(toUnit);
    return new Units(amount, parsedFromUnit).to(parsedToUnit).toNumber();
  }

  static convertToGallons(amount: number, unit: string) {
    return this.convertToUnit(amount, unit, "gallons");
  }

  static convertToPounds(amount: number, unit: string) {
    return this.convertToUnit(amount, unit, "lbs");
  }

  static isLiquidUnit = (unit: string) =>
    UnitsHelper.isCompatibleUnit(this.parseUnit(unit), "gallons");
}
