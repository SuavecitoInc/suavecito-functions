// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Operation} Operation
 */
/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input: { deliveryCustomization: any; cart?: any }) {
  // Define a type for your configuration, and parse it from the metafield
  /**
   * @type {{
   *  customPropType: 'line_item' | 'cart'
   *  customPropKey: string
   *  shipOptionTitleMatch: string
   * }}
   */
  const configuration = JSON.parse(
    input?.deliveryCustomization?.metafield?.value ?? "{}",
  );
  if (
    !configuration.customPropType ||
    !configuration.customPropKey ||
    !configuration.shipOptionTitleMatch
  ) {
    return NO_CHANGES;
  }

  const key = "_sp_dc_key";
  const propType = configuration.customPropType;
  const value = configuration.customPropKey;
  const titleMatch = configuration.shipOptionTitleMatch;
  const hasCustomAttribute =
    input.cart.attribute?.key === key &&
    input.cart.attribute?.value.toLowerCase() === value.toLowerCase();
  const hasLineCustomAttribute = input.cart.lines.some(
    (lineItem: { attribute: { key: string; value: string } }) =>
      lineItem.attribute?.key === key &&
      lineItem.attribute?.value.toLowerCase() === value.toLowerCase(),
  );
  const hasMatch =
    propType === "line_item" ? hasLineCustomAttribute : hasCustomAttribute;

  let toRemove = input.cart.deliveryGroups
    .flatMap((group: { deliveryOptions: any }) => group.deliveryOptions)
    .filter((option: { handle: any; title: any }) => {
      console.log("TITLE", option.title);
      console.log("INCLUDES TITLE", option.title.includes(titleMatch));
      console.log("HAS CUSTOM ATTRIBUTE", hasCustomAttribute);
      console.log("HAS LINE CUSTOM ATTRIBUTE", hasLineCustomAttribute);
      return (
        hasMatch &&
        option.title.toLowerCase().includes(titleMatch.toLowerCase())
      );
    })
    .map((option: { handle: any }) => /** @type {Operation} */ ({
      hide: {
        deliveryOptionHandle: option.handle,
      },
    }));

  return {
    operations: toRemove,
  };
}
