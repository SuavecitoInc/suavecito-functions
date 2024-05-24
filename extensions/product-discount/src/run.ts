// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";
import type { RunInput } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Target} Target
 * @typedef {import("../generated/api").ProductVariant} ProductVariant
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input: RunInput) {
  // Define a type for your configuration, and parse it from the metafield
  /**
   * @type {{
   *   quantity: number
   *   percentage: number
   *   excludedSkus: string[]
   *   excludedVendors: string[]
   * }}
   */
  const configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}",
  );
  console.log("Configuration", JSON.stringify(configuration, null, 2));
  console.log("Input", JSON.stringify(input, null, 2));

  if (!configuration.quantity || !configuration.percentage) {
    return EMPTY_DISCOUNT;
  }

  console.log("Configuration", JSON.stringify(configuration, null, 2));

  const excludedSkus = configuration.excludedSkus.map((sku: string) =>
    sku.toLowerCase(),
  );
  console.log("Excluded SKUs", excludedSkus);
  const excludedVendors = configuration.excludedVendors.map((vendor: string) =>
    vendor.toLowerCase(),
  );
  console.log("Excluded Vendors", excludedVendors);

  const targets = input.cart.lines
    // Use the configured quantity instead of a hardcoded value
    .filter(
      (line) =>
        line.quantity >= configuration.quantity &&
        line.merchandise.__typename == "ProductVariant" &&
        !excludedSkus.includes(line.merchandise.sku?.toLowerCase()) &&
        !excludedVendors.includes(
          line.merchandise.product.vendor?.toLowerCase(),
        ) &&
        line.merchandise.excludeFromAllDiscounts?.value !== "true",
    )
    .map((line) => {
      const variant = /** @type {ProductVariant} */ line.merchandise;

      return /** @type {Target} */ {
        productVariant: {
          // @ts-expect-error
          id: variant.id,
        },
      };
    });

  if (!targets.length) {
    console.error("No cart lines qualify for volume discount.");
    return EMPTY_DISCOUNT;
  }

  console.log("Configuration", configuration);

  return {
    discounts: [
      {
        targets,
        value: {
          percentage: {
            // Use the configured percentage instead of a hardcoded value
            value: configuration.percentage.toString(),
          },
        },
      },
    ],
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };
}
