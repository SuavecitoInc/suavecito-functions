# CHANGELOG

## Todo

- Update the apps index route to display all current features.

## Unreleased

## v0.0.4 - 2025-07-30

**Breaking Changes**

- The Buy X Get Y Product Discount settings have been extended with new settings.
  - In collection: this setting filters out products that are not in the selected collection.
  - Include excluded variants in total: this setting allows excluded variants to be included in the total.
- The UI has been updated to reflect the new settings.
- The Product Discount settings have been extended with new settings.
  - Include or exclude selected collections: this setting allows you to include or exclude products in the selected collections.

**Fixes**

- The Product Discount Update had a bug that caused the selected collections to not be saved correctly. This has been fixed.

**To Do**

- Todo: Implement an exclude / exclude products in selected collections.

## v0.0.4 - 2025-07-28

**Breaking Changes**

- I have updated the Shopify Admin API to 2025-07.
- The node image being used for the app was also updated from node 18 to node 22.
- All packages were also updated.

## v0.0.3 - 2024-07-30

**Features**

- Buy X Get Y Product Discount
  - This function creates a simple (really basic) Buy X Get Y product discount
  - The function takes 3 arguments: Buy X (number of products), Get Y (number of products), and Percentage (discount percentage)
  - The function will handle the rest of the logic. Including the discount split. Eligible products depend on a variant metafield: `variant.metafields.debut.enable_b2g1f` \*\* metafield namespace and key could change
    - Ex: Buy 2 Get 1 Free. Input = 5 eligible products, Discount Split = 4 Paid, 1 Free.
    - Ex: Buy 2 Get 1 Free. Input = 6 eligible products, Discount Split = 4 Paid, 2 Free.

**Limitations**

- Discount allocations are not available in the Shipping Discount function input: [Cart object](https://shopify.dev/docs/api/functions/reference/shipping-discounts/graphql/common-objects/cart)
- Workaround:
  - use total instead of subtotal.
  - total includes discounts, but also includes shipping cost. As it has yet to be discounted, \*\* if applicable.
  - the total is calculated as `(total - lowest cost delivery option)`, this is then used to check if `total > minimum` amount

## Released

## v.0.0.2

**Features**

- Custom Checkout Banner
  - 2 banner targets were added, one above the line items and one in the shipping section.
- Product Discount (Percent Off)
  - This function creates a product variant discount, the discount is limited to a percentage of the original price
  - Product variants can be excluded by sku and or vendor
  - To exclude a product variant from all discounts created by this app, simply set the Suavecito Function - Exclude from all discounts metafield to true
  - Example use case: discount specific product variants, instead of whole product listings
- Shipping Discount (Percent Off)
  - This function creates a shipping discount, the discount is limited to a percentage of the original shipping price
  - The function takes 3 arguments: discount percentage, shipping country code and minimum purchase amount
  - If the requirements are met (shipping country & min purchase amount), the function will select the cheapest priced shipping option from the currently available options, and it will discount it by the selected discount percentage
  - Example use case: Free US Shipping Over $50.

## v.0.0.1

**Features**

- Initial release
- Delivery Customization Hide Option
  - This function hides a delivery option
  - Set the custom property (cart attribute or line item property) and value to match against
  - Set the Ship Option Title / Name to match against
- Delivery Customization Rename Option
  - This function renames a delivery option by appending a message to the end of the title
  - Set the custom property (cart attribute or line item property) and value to match against
  - Set the Ship Option Title / Name to match against
