# CHANGELOG

## Unreleased

## Todo

- Update the apps index route to display all current features.

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
  - If the requirements are met (shipping country & min purhcase amount), the function will select the cheapest priced shipping option from the currently available options, and it will discount it by the selected discount percentage
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
