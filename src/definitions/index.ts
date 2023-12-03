import liquidDefinitions from "./liquid";
import solidDefinitions from "./solid";
import seedDefinitions from "./seed";
import yieldDefinitions from "./yield";
import areaDefinitions from "./area";
import { UnitRedefinitionError, UndefinedUnitError } from "../errors";
import { InflatedUnit, Unit } from "../types";

export const inflatedUnits: Record<string, InflatedUnit> = {};
export const selectableUnitsByGroup: Record<string, string[]> = {};

function addUnitDefinitionWithoutError(
  group: string,
  name: string,
  value: number,
  primaryName: string,
  fullName: string
) {
  if (!inflatedUnits[name]) {
    inflatedUnits[name] = {
      group,
      value,
      primaryName,
      fullName,
    };
  }
}

function addUnitDefinition(
  group: string,
  name: string,
  value: number,
  primaryName: string,
  fullName: string
) {
  if (inflatedUnits[name]) {
    throw new UnitRedefinitionError(
      `${name} is already a defined unit. Do not redefine units`
    );
  }

  addUnitDefinitionWithoutError(group, name, value, primaryName, fullName);
}

/**
 * Used to expand the definitions provided into a more robust object with multiple lookup keys.
 * allows looking up units by their short name, plural name, or any alias.
 * Additionally, it builds a list of common selectable units.
 *
 * @param compatibilityGroup
 * @param definitions
 */
function inflateUnits(
  compatibilityGroup: string,
  definitions: Record<string, Unit>
) {
  Object.keys(definitions).forEach((unitName) => {
    const definition = definitions[unitName];
    addUnitDefinition(
      compatibilityGroup,
      unitName,
      definition.value,
      unitName,
      definition.name
    );
    addUnitDefinitionWithoutError(
      compatibilityGroup,
      definition.name,
      definition.value,
      unitName,
      definition.name
    );
    const plural =
      definition.name +
      (definition.name[definition.name.length - 1] === "s" ? "es" : "s");
    addUnitDefinitionWithoutError(
      compatibilityGroup,
      plural,
      definition.value,
      unitName,
      definition.name
    );

    (definition.aliases || []).forEach((aliasName) => {
      addUnitDefinition(
        compatibilityGroup,
        aliasName,
        definition.value,
        unitName,
        definition.name
      );
      const plural =
        aliasName + (aliasName[aliasName.length - 1] === "s" ? "es" : "s");
      addUnitDefinitionWithoutError(
        compatibilityGroup,
        plural,
        definition.value,
        unitName,
        definition.name
      );
    });

    if (definition.selectableAs) {
      selectableUnitsByGroup[compatibilityGroup] =
        selectableUnitsByGroup[compatibilityGroup] || [];
      if (definition.default) {
        selectableUnitsByGroup[compatibilityGroup].unshift(
          definition.selectableAs
        );
      } else {
        selectableUnitsByGroup[compatibilityGroup].push(
          definition.selectableAs
        );
      }
    }
  });
}

inflateUnits("liquid", liquidDefinitions);
inflateUnits("weight", solidDefinitions);
inflateUnits("seed", seedDefinitions);
inflateUnits("yield", yieldDefinitions);
inflateUnits("area", areaDefinitions);
