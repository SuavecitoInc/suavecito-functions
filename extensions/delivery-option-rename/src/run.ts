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
   *  shipOptionTitleMatch: string
   *  message: number
   * }}
   */
  const configuration = JSON.parse(
    input?.deliveryCustomization?.metafield?.value ?? "{}",
  );
  if (!configuration.shipOptionTitleMatch || !configuration.message) {
    return NO_CHANGES;
  }

  const titleMatch = configuration.shipOptionTitleMatch;
  const message = configuration.message;

  let toRename = input.cart.deliveryGroups
    .flatMap((group: { deliveryOptions: any }) => group.deliveryOptions)
    .filter((option: { handle: any; title: any }) => {
      return option.title.toLowerCase().includes(titleMatch.toLowerCase());
    })
    .map((option: { handle: any; title: any }) => /** @type {Operation} */ ({
      rename: {
        deliveryOptionHandle: option.handle,
        // Use the configured message instead of a hardcoded value
        title: option.title ? `${option.title} - ${message}` : message,
      },
    }));

  return {
    operations: toRename,
  };
}
