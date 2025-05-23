import type { RunInput, FunctionRunResult } from "../generated/api";
// import { DiscountApplicationStrategy } from "../generated/api";

const EMPTY_DISCOUNT: FunctionRunResult = {
  discounts: [],
};

type Configuration = {
  percentage: number;
  shipCountryCode: string;
  minPurchaseAmount: number;
};

export function run(input: RunInput): FunctionRunResult {
  const configuration: Configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}",
  );

  console.log("CONFIGURATION", JSON.stringify(configuration, null, 2));

  if (
    !configuration.percentage ||
    !configuration.shipCountryCode ||
    !configuration.minPurchaseAmount
  ) {
    return EMPTY_DISCOUNT;
  }

  const { percentage, shipCountryCode, minPurchaseAmount } = configuration;

  console.log("PERCENTAGE", percentage);
  console.log("SHIP COUNTRY", shipCountryCode);
  console.log("MIN PURCHASE AMOUNT", minPurchaseAmount);

  const countryCode =
    input.cart.deliveryGroups.length > 0
      ? input.cart.deliveryGroups[0].deliveryAddress?.countryCode
      : null;

  console.log("CURRENT COUNTRY CODE", countryCode);

  // const subtotal = parseFloat(input.cart.cost.subtotalAmount.amount);
  let total = parseFloat(input.cart.cost.totalAmount.amount);
  console.log("TOTAL", total);

  // not the right country
  if (countryCode !== shipCountryCode) {
    return EMPTY_DISCOUNT;
  }

  // check if there are subscription items in the cart
  const hasSubscriptionItems = input.cart.lines.some(
    (line) =>
      line?.sellingPlanAllocation !== null &&
      line?.sellingPlanAllocation !== undefined,
  );
  console.log("CHECKING IF CART HAS SUBSCRIPTION ITEMS", hasSubscriptionItems);

  let lowestCostDeliveryOption = input.cart.deliveryGroups
    .flatMap((group) => group.deliveryOptions)
    .reduce((prev, current) =>
      parseFloat(prev.cost.amount) < parseFloat(current.cost.amount)
        ? prev
        : current,
    );

  console.log("CHECKING LOWEST COST DELIVERY OPTION");

  if (parseFloat(lowestCostDeliveryOption.cost.amount) === 0) {
    console.log("CHEAPEST DELIVERY OPTION IS FREE");
    console.log("FINDING NEXT CHEAPEST DELIVERY OPTION");
    // find the next lowest cost delivery option
    const filteredDeliveryOptions = input.cart.deliveryGroups
      .flatMap((group) => group.deliveryOptions)
      .filter((option) => parseFloat(option.cost.amount) !== 0);

    lowestCostDeliveryOption = filteredDeliveryOptions.reduce(
      (prev, current) =>
        parseFloat(prev.cost.amount) < parseFloat(current.cost.amount)
          ? prev
          : current,
    );
  }

  console.log(
    "LOWEST COST DELIVERY OPTION",
    JSON.stringify(lowestCostDeliveryOption, null, 2),
  );

  const lowestCostDeliveryOptionCost = lowestCostDeliveryOption
    ? parseFloat(lowestCostDeliveryOption.cost.amount)
    : 0;

  console.log("LOWEST COST DELIVERY OPTION COST", lowestCostDeliveryOptionCost);

  total -= lowestCostDeliveryOptionCost;

  console.log("TOTAL MINUS CHEAPEST DELIVERY OPTION", total);

  if (!lowestCostDeliveryOption) {
    return EMPTY_DISCOUNT;
  }

  // not enough purchase
  if (total < minPurchaseAmount) {
    console.log("SUBTOTAL LESS THAN MIN PURCHASE", minPurchaseAmount);
    return EMPTY_DISCOUNT;
  }

  return {
    discounts: [
      {
        value: {
          percentage: {
            value: percentage ? percentage.toString() : "0",
          },
        },
        targets: [
          {
            deliveryOption: {
              handle: lowestCostDeliveryOption.handle,
            },
          },
        ],
        message: `FREE SHIPPING`,
      },
    ],
  };
}
