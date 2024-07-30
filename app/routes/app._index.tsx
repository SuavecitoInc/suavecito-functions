import { useEffect, useState } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  // return null;
  const uptime = process.uptime();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const nodeVersion = process.version;
  const hostname = process.env.HOSTNAME;
  const hostOS = process.platform;
  return json({ uptime, timezone, nodeVersion, hostname, hostOS });
};

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();

  const [localUptime, setLocalUptime] = useState(loaderData.uptime);

  const formatUptime = (uptime: number) => {
    function pad(s: number) {
      return (s < 10 ? "0" : "") + s;
    }
    const hours = Math.floor(uptime / (60 * 60));
    const minutes = Math.floor((uptime % (60 * 60)) / 60);
    const seconds = Math.floor(uptime % 60);

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLocalUptime((uptime) => uptime + 1);
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <Page>
      <ui-title-bar title="Suavecito Functions" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="500">
                  <Text as="h2" variant="headingMd">
                    Delivery Customizations 🚚
                  </Text>
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingMd">
                      Delivery Option Hide 🫣
                    </Text>
                    <List>
                      <List.Item>
                        This function hides a <i>delivery option</i>
                      </List.Item>
                      <List.Item>
                        Set the custom property (cart attribute or line item
                        property) and value to match against
                      </List.Item>
                      <List.Item>
                        Set the Ship Option Title / Name to match against
                      </List.Item>
                    </List>
                  </BlockStack>
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingMd">
                      Delivery Option Rename 🤫
                    </Text>
                    <List>
                      <List.Item>
                        This function renames a <i>delivery option</i> by
                        appending a <i>message</i> to the end of the title
                      </List.Item>
                      <List.Item>
                        Set the custom property (cart attribute or line item
                        property) and value to match against
                      </List.Item>
                      <List.Item>
                        Set the Ship Option Title / Name to match against
                      </List.Item>
                    </List>
                  </BlockStack>
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="500">
                  <Text as="h2" variant="headingMd">
                    Product Discounts 📦
                  </Text>
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingMd">
                      Percent Off Discount 😎
                    </Text>
                    <List>
                      <List.Item>
                        This function creates a <i>product variant discount</i>{" "}
                        the discount is limited to <i>a percentage</i> of the
                        original price
                      </List.Item>
                      <List.Item>
                        Product variants can be excluded by <i>sku</i> and or{" "}
                        <i>vendor</i>
                      </List.Item>
                      <List.Item>
                        To exclude a product variant from all discounts created
                        by this app, simply set the{" "}
                        <i>Suavecito Function - Exclude from all discounts</i>{" "}
                        metafield to <i>true</i>
                      </List.Item>
                    </List>
                  </BlockStack>
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingMd">
                      Buy X Get Y - Percent Off Discount 😉
                    </Text>
                    <List>
                      <List.Item>
                        This function creates a simple (really basic) Buy X Get
                        Y product discount
                      </List.Item>
                      <List.Item>
                        The function takes 3 arguments: Buy X (number of
                        products), Get Y (number of products), and Percentage
                        (discount percentage)
                      </List.Item>
                      <List.Item>
                        The function will handle the rest of the logic.
                        Including the discount split. Eligible products depend
                        on a variant metafield:{" "}
                        <strong>variant.metafields.debut.enable_b2g1f</strong>{" "}
                        <i>** metafield namespace and key could change</i>
                      </List.Item>
                    </List>
                  </BlockStack>
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="500">
                  <Text as="h2" variant="headingMd">
                    Shipping Discounts 📦
                  </Text>
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingMd">
                      Percent Off Discount 😎
                    </Text>
                    <List>
                      <List.Item>
                        This function creates a shipping discount, the discount
                        is limited to a percentage of the original shipping
                        price
                      </List.Item>
                      <List.Item>
                        The function takes 3 arguments: discount percentage,
                        shipping country code and minimum purchase amount
                      </List.Item>
                      <List.Item>
                        If the requirements are met (shipping country & min
                        purchase amount), the function will select the cheapest
                        priced shipping option from the currently available
                        options, and it will discount it by the selected
                        discount percentage
                      </List.Item>
                      <List.Item>
                        <strong>Example use case: </strong>
                        <i>Free US Shipping Over $50.</i>
                      </List.Item>
                    </List>
                  </BlockStack>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Server Information
                  </Text>
                  <BlockStack gap="200">
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Uptime
                      </Text>
                      <Text as="span" variant="bodyMd">
                        {formatUptime(localUptime)}
                      </Text>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Time Zone
                      </Text>
                      <Text as="span" variant="bodyMd">
                        {loaderData.timezone}
                      </Text>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Node Version
                      </Text>
                      <Text as="span" variant="bodyMd">
                        {loaderData.nodeVersion}
                      </Text>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        OS
                      </Text>
                      <Text as="span" variant="bodyMd">
                        {loaderData.hostOS}
                      </Text>
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    App Specs
                  </Text>
                  <BlockStack gap="200">
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Framework
                      </Text>
                      <Link
                        url="https://remix.run"
                        target="_blank"
                        removeUnderline
                      >
                        Remix
                      </Link>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Database
                      </Text>
                      <Link
                        url="https://www.prisma.io/"
                        target="_blank"
                        removeUnderline
                      >
                        Prisma
                      </Link>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Interface
                      </Text>
                      <span>
                        <Link
                          url="https://polaris.shopify.com"
                          target="_blank"
                          removeUnderline
                        >
                          Polaris
                        </Link>
                        {", "}
                        <Link
                          url="https://shopify.dev/docs/apps/tools/app-bridge"
                          target="_blank"
                          removeUnderline
                        >
                          App Bridge
                        </Link>
                      </span>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        API
                      </Text>
                      <Link
                        url="https://shopify.dev/docs/api/admin-graphql"
                        target="_blank"
                        removeUnderline
                      >
                        GraphQL API
                      </Link>
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Checkout Banner
                  </Text>
                  <BlockStack gap="200">
                    <List>
                      <List.Item>
                        2 banner targets available, one above the line items and
                        one in the shipping section.
                      </List.Item>
                    </List>
                  </BlockStack>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
