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
export function run(input: { deliveryCustomization: any; cart?: any; }) {
  // Define a type for your configuration, and parse it from the metafield
  /**
  * @type {{
  *  stateProvinceCode: string
  *  message: number
  * }}
  */
  const configuration = JSON.parse(
    input?.deliveryCustomization?.metafield?.value ?? "{}"
  );
  if (!configuration.stateProvinceCode || !configuration.message) {
    return NO_CHANGES;
  }

  let toRename = input.cart.deliveryGroups
    .filter((group: { deliveryAddress: { provinceCode: any; }; }) => group.deliveryAddress?.provinceCode &&
      // Use the configured province code instead of a hardcoded value
      group.deliveryAddress.provinceCode == configuration.stateProvinceCode)
    .flatMap((group: { deliveryOptions: any; }) => group.deliveryOptions)
    .map((option: { handle: any; title: any; }) => /** @type {Operation} */({
      rename: {
        deliveryOptionHandle: option.handle,
        // Use the configured message instead of a hardcoded value
        title: option.title ? `${option.title} - ${configuration.message}` : configuration.message
      }
    }));

  return {
    operations: toRename
  };
};
