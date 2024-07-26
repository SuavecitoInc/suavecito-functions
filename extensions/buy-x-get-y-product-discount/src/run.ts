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

type Item = {
  id: string;
  quantity: number;
  price: number;
};

// helpers
// filter line items by metafield value to get qualifying items
function getQualifyingItems(lines: RunInput["cart"]["lines"]) {
  const qualifyingItems = lines.filter(
    // @ts-ignore
    (line) => line.merchandise?.buy2Get1FreeEligible?.value === "true",
  );
  console.log("qualifyingItems to transform", qualifyingItems.length);
  // transform qualifying items into variants
  const qualifyingVariants = qualifyingItems.map((line: any) => {
    return {
      id: line.merchandise.id,
      quantity: line.quantity,
      price: parseFloat(line.cost.amountPerQuantity.amount),
    };
  });
  // get total quantity of qualifying items
  const total = qualifyingVariants.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  return {
    qualifyingItems: qualifyingVariants,
    total,
  };
}

// sort items by price
function sortByPrice(items: Item[]) {
  const sortedItems = items.sort((a, b) => a.price - b.price);
  return sortedItems;
}

// calculate discount split for buy x get y discount
function calculateDiscountSplit(quantity: number, buyX: number, getY: number) {
  const x = buyX;
  const y = getY;
  const i = quantity;

  const r = i % (x + y);
  const n = (i - r) / (x + y);
  const py = Math.max(0, r - x) + n * y;
  const px = i - py;

  return {
    buyX: px,
    getY: py,
  };
}

// get variants to discount, use sorted items to get the cheapest items first
function getVariantsToDiscount(items: any[], discountQty: number) {
  const variantsToDiscount = [];
  let qty = discountQty;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (qty > 0) {
      if (item.quantity <= qty) {
        variantsToDiscount.push(item);
        qty -= item.quantity;
      } else {
        variantsToDiscount.push({ ...item, quantity: qty });
        qty = 0;
      }
    }
  }

  return variantsToDiscount;
}

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input: RunInput) {
  // Define a type for your configuration, and parse it from the metafield
  /**
   * @type {{
   *   buyX: number
   *  getX: number
   *   percentage: number
   * }}
   */
  const configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}",
  );

  if (!configuration.buyX || !configuration.getY || !configuration.percentage) {
    return EMPTY_DISCOUNT;
  }

  // start
  // get qualifying items and total quantity of qualifying items
  const { qualifyingItems, total } = getQualifyingItems(input.cart.lines);

  // sort qualifying items by price
  const sortedItems = sortByPrice(qualifyingItems);
  // console.log("sortedItems", JSON.stringify(sortedItems, null, 2));

  // this will be the buy x get y discount values from the configuration
  const buyX = 2;
  const getY = 1;

  // calculate discount split for buy x get y discount
  const discountSplit = calculateDiscountSplit(total, buyX, getY);
  console.log("discountSplit", JSON.stringify(discountSplit, null, 2));

  // get variants to discount (use sorted items to get the cheapest items first) and use for input to apply discount
  const variantsToDiscount = getVariantsToDiscount(
    sortedItems,
    discountSplit.getY,
  );
  // console.log(
  //   "variantsToDiscount",
  //   JSON.stringify(variantsToDiscount, null, 2),
  // );

  if (!variantsToDiscount.length) {
    console.error("No cart lines qualify for buy x get y discount.");
    return EMPTY_DISCOUNT;
  }

  return {
    discounts: [
      {
        targets: variantsToDiscount.map((variant) => {
          return {
            productVariant: {
              id: variant.id,
              quantity: variant.quantity,
            },
          };
        }),
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
