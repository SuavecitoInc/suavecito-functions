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
   *   excludeB2B?: boolean
   *   excludePOS?: boolean
   *   includeProductsInCollections?: boolean
   * }}
   */
  const configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}",
  );

  if (!configuration.quantity || !configuration.percentage) {
    return EMPTY_DISCOUNT;
  }

  console.log("Configuration", configuration);

  const excludeB2B = configuration.excludeB2B ?? false;
  const excludePOS = configuration.excludePOS ?? false;

  // exclude if the buyer is b2b
  const purchasingCompany = input.cart.buyerIdentity?.purchasingCompany;
  console.log("Buyer identity purchasing company:", purchasingCompany);
  if (excludeB2B && purchasingCompany) {
    console.log(
      `Buyer is associated with purchasing company ${purchasingCompany.company.name}, excluding from discount.`,
    );
    return EMPTY_DISCOUNT;
  }

  const isPOS = input.cart.attribute?.value === "pos";
  console.log("Cart attribute value for _source:", input.cart.attribute?.value);
  if (excludePOS && isPOS) {
    console.log("Cart is from POS, excluding from discount.");
    return EMPTY_DISCOUNT;
  }

  const excludedSkus = (configuration.excludedSkus ?? []).map((sku: string) =>
    sku.toLowerCase(),
  );

  const excludedVendors = (configuration.excludedVendors ?? []).map(
    (vendor: string) => vendor.toLowerCase(),
  );

  const includeProductsInCollections =
    configuration?.includeProductsInCollections ?? false;

  // to filter out subscriptions, we can use line.sellingPlanAllocation
  const lines = includeProductsInCollections
    ? // include lines that are in any selected collection
      input.cart.lines.filter(
        (line) =>
          line.merchandise.__typename == "ProductVariant" &&
          line.merchandise.product.inAnyCollection,
      )
    : // exclude lines that are in any selected collection
      input.cart.lines.filter(
        (line) =>
          line.merchandise.__typename == "ProductVariant" &&
          !line.merchandise.product.inAnyCollection,
      );

  const targets = lines
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
