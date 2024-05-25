# Shopify Functions

> Shopify Functions allow developers to customize the backend logic of Shopify.

<p align="center">
  <img src="./public/suavecito-functions-logo.png" alt="Suavecito Functions" width="250">
</p>

[Shopify Functions Overview](https://shopify.dev/docs/apps/functions)

## Dev

```bash
shopify app dev
```

## Deploy / Re-Deploy

```bash
shopify app deploy
```

## Generate New Delivery Customization Extension

```bash
shopify app generate extension --template delivery_customization --name delivery-customization
```

## Deployment Environmental Variables

```bash
SHOPIFY_API_KEY=
SHOPIFY_API_SECRET=
SHOPIFY_APP_URL=https://functions.suavecito.com
SCOPES=write_delivery_customizations,write_products,write_content
```

## Functions

<p align="center">
  <img src="./screenshots/suavecito-functions-embed.jpg" alt="Suavecito Functions" width="1200">
</p>

### Delivery Customization

> You can use delivery customizations to hide, reorder, and rename the delivery options that are available to buyers during checkout.

Delivery Option Hide

- This function hides a `delivery option`.
- Set the custom property (cart attribute or line item property) and value to match against
- Set the Ship Option Title / Name to match against

<p align="center">
  <img src="./screenshots/suavecito-functions-delivery-option-hide.jpg" alt="Delivery Option Hide" width="1200">
</p>

Delivery Option Rename

- This function renames a `delivery option` by appending a message to the end of the title
- Set the custom property (cart attribute or line item property) and value to match against
- Set the Ship Option Title / Name to match against

<p align="center">
  <img src="./screenshots/suavecito-functions-delivery-option-rename.jpg" alt="Delivery Option Rename" width="1200">
</p>

### Product Discounts

> The Product Discount API enables you to create a new type of discount that is applied to a particular product or product variant in the cart.

Product Discount

- This function creates a product variant discount the discount is limited to a percentage of the original price
- Product variants can be excluded by sku and or vendor
- To exclude a product variant from all discounts created by this app, simply set the Suavecito Function - Exclude from all discounts metafield to true

<p align="center">
  <img src="./screenshots/suavecito-functions-product-discount.jpg" alt="Delivery Option Rename" width="1200">
</p>
