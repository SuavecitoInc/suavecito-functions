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

  const subtotal = parseFloat(input.cart.cost.subtotalAmount.amount);
  console.log("SUBTOTAL", subtotal);

  // not the right country
  if (countryCode !== shipCountryCode) {
    return EMPTY_DISCOUNT;
  }
  // not enough purchase
  if (subtotal < minPurchaseAmount) {
    console.log("SUBTOTAL LESS THAN MIN PURCHASE", minPurchaseAmount);
    return EMPTY_DISCOUNT;
  }

  const lowestCostDeliveryOption = input.cart.deliveryGroups
    .flatMap((group) => group.deliveryOptions)
    .reduce((prev, current) =>
      parseFloat(prev.cost.amount) < parseFloat(current.cost.amount)
        ? prev
        : current,
    );

  console.log(
    "LOWEST COST DELIVERY OPTION",
    JSON.stringify(lowestCostDeliveryOption, null, 2),
  );

  if (!lowestCostDeliveryOption) {
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
