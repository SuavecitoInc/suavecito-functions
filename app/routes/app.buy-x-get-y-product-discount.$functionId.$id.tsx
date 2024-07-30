import { useEffect, useMemo } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useForm, useField } from "@shopify/react-form";
import { CurrencyCode } from "@shopify/react-i18n";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import type { Field } from "@shopify/discount-app-components";
import {
  ActiveDatesCard,
  CombinationCard,
  DiscountClass,
  DiscountMethod,
  MethodCard,
  DiscountStatus,
  RequirementType,
  SummaryCard,
  UsageLimitsCard,
} from "@shopify/discount-app-components";
import {
  Banner,
  Card,
  Text,
  Layout,
  Page,
  PageActions,
  TextField,
  BlockStack,
} from "@shopify/polaris";

import shopify from "../shopify.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { id } = params;
  const { admin } = await shopify.authenticate.admin(request);

  // const gid = `gid://shopify/DiscountAutomaticNode/${id}`;
  const gid = `gid://shopify/DiscountNode/${id}`;
  console.log("GID", gid);

  const automaticDiscountResponse = await admin.graphql(
    `#graphql
        query getDiscountAutomaticNode($id: ID!) {
          discountNode(id: $id) {
            id
            discount {
              ... on DiscountCodeBasic {
                __typename
                title
                combinesWith {
                  orderDiscounts
                  productDiscounts
                  shippingDiscounts
                }
                startsAt
                endsAt
                status
              }
              ... on DiscountCodeBxgy {
                __typename
                title
                combinesWith {
                  orderDiscounts
                  productDiscounts
                  shippingDiscounts
                }
                startsAt
                endsAt
                status
              }
              ... on DiscountCodeFreeShipping {
                __typename
                title
                combinesWith {
                  orderDiscounts
                  productDiscounts
                  shippingDiscounts
                }
                startsAt
                endsAt
                status
              }
              ... on DiscountAutomaticApp {
                __typename
                title
                combinesWith {
                  orderDiscounts
                  productDiscounts
                  shippingDiscounts
                }
                startsAt
                endsAt
                status
              }
              ... on DiscountCodeApp {
                __typename
                title
                combinesWith {
                  orderDiscounts
                  productDiscounts
                  shippingDiscounts
                }
                usageLimit
                appliesOncePerCustomer
                startsAt
                endsAt
                status
              }
              ... on DiscountAutomaticBasic {
                __typename
                title
                combinesWith {
                  orderDiscounts
                  productDiscounts
                  shippingDiscounts
                }
                startsAt
                endsAt
                status
              }
              ... on DiscountAutomaticBxgy {
                __typename
                title
                combinesWith {
                  orderDiscounts
                  productDiscounts
                  shippingDiscounts
                }
                startsAt
                endsAt
                status
              }
              ... on DiscountAutomaticFreeShipping {
                __typename
                title
                combinesWith {
                  orderDiscounts
                  productDiscounts
                  shippingDiscounts
                }
                startsAt
                endsAt
                status
              }
            }
            metafield(namespace: "$app:buy-x-get-y-product-discount", key: "function-configuration") {
              id
              value
            }
          }
        }`,
    {
      variables: {
        id: gid,
      },
    },
  );

  const responseJson = await automaticDiscountResponse.json();
  console.log("RESPONSE JSON", JSON.stringify(responseJson, null, 2));
  const discountNode = responseJson.data.discountNode;
  const isAutomaticDiscount = discountNode.discount.__typename.includes(
    "DiscountAutomaticApp",
  );
  const metafieldValue = JSON.parse(discountNode.metafield.value);

  console.log("isAutomaticDiscount", isAutomaticDiscount);

  return {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      discountNode,
      discountMethod: isAutomaticDiscount
        ? DiscountMethod.Automatic
        : DiscountMethod.Code,
      configuration: {
        buyX: metafieldValue?.buyX,
        getY: metafieldValue?.getY,
        percentage: metafieldValue?.percentage,
      },
    }),
  };
};

// This is a server-side action that is invoked when the form is submitted.
// It makes an admin GraphQL request to create a discount.
export const action = async ({ params, request }: ActionFunctionArgs) => {
  const { functionId, id } = params;
  const { admin } = await shopify.authenticate.admin(request);
  const formData = await request.formData();
  const {
    title,
    method,
    code,
    combinesWith,
    usageLimit,
    appliesOncePerCustomer,
    startsAt,
    endsAt,
    configuration,
    metafield,
  } = JSON.parse(formData.get("discount") as string);

  const baseDiscount = {
    functionId,
    title,
    combinesWith,
    startsAt: new Date(startsAt),
    endsAt: endsAt && new Date(endsAt),
  };

  if (method === DiscountMethod.Code) {
    const baseCodeDiscount = {
      ...baseDiscount,
      title: code,
      code,
      usageLimit,
      appliesOncePerCustomer,
    };

    const response = await admin.graphql(
      `#graphql
          mutation UpdateCodeDiscount($discount: DiscountCodeAppInput!, $id: ID!) {
            discountUpdate: discountCodeAppUpdate(codeAppDiscount: $discount, id: $id) {
              userErrors {
                code
                message
                field
              }
            }
          }`,
      {
        variables: {
          id: `gid://shopify/DiscountCodeNode/${id}`,
          discount: {
            ...baseCodeDiscount,
            metafields: [
              {
                id: metafield.id,
                value: JSON.stringify({
                  buyX: configuration.buyX,
                  getY: configuration.getY,
                  percentage: configuration.percentage,
                }),
              },
            ],
          },
        },
      },
    );

    const responseJson = await response.json();
    const errors = responseJson.data.discountUpdate?.userErrors;
    return json({ errors });
  } else {
    const response = await admin.graphql(
      `#graphql
          mutation UpdateAutomaticDiscount($discount: DiscountAutomaticAppInput!, $id: ID!) {
            discountUpdate: discountAutomaticAppUpdate(automaticAppDiscount: $discount, id: $id) {
              userErrors {
                code
                message
                field
              }
            }
          }`,
      {
        variables: {
          id: `gid://shopify/DiscountAutomaticNode/${id}`,
          discount: {
            ...baseDiscount,
            metafields: [
              {
                id: metafield.id,
                value: JSON.stringify({
                  buyX: configuration.buyX,
                  getY: configuration.getY,
                  percentage: configuration.percentage,
                }),
              },
            ],
          },
        },
      },
    );

    const responseJson = await response.json();
    const errors = responseJson.data.discountUpdate?.userErrors;
    return json({ errors });
  }
};

// This is the React component for the page.
export default function ProductDiscount() {
  const submitForm = useSubmit();
  const actionData = useActionData<any>();
  const loaderData = useLoaderData<any>();
  const navigation = useNavigation();
  const todaysDate = useMemo(() => new Date(), []);

  const isLoading = navigation.state === "submitting";
  const currencyCode = CurrencyCode.Usd;
  const submitErrors = actionData?.errors || [];

  const {
    discountNode,
    discountMethod: discountNodeMethod,
    configuration: discountConfiguration,
  } = JSON.parse(loaderData.body);

  useEffect(() => {
    if (actionData?.errors.length === 0) {
      open("shopify://admin/discounts", "_top");
    }
  }, [actionData]);

  const {
    fields: {
      discountTitle,
      discountCode,
      discountMethod,
      combinesWith,
      requirementType,
      requirementSubtotal,
      requirementQuantity,
      usageLimit,
      appliesOncePerCustomer,
      startDate,
      endDate,
      configuration,
    },
    submit,
  } = useForm({
    fields: {
      discountTitle: useField(discountNode?.discount.title ?? ""),
      discountMethod: useField(discountNodeMethod ?? DiscountMethod.Automatic),
      discountCode: useField(discountNode?.discount?.title ?? ""),
      combinesWith: useField({
        orderDiscounts: discountNode?.discount?.combinesWith?.orderDiscounts,
        productDiscounts:
          discountNode?.discount?.combinesWith?.productDiscounts,
        shippingDiscounts:
          discountNode?.discount?.combinesWith?.shippingDiscounts,
      }),
      requirementType: useField(RequirementType.None),
      requirementSubtotal: useField("0"),
      requirementQuantity: useField("0"),
      usageLimit: useField(
        discountNodeMethod === DiscountMethod.Code
          ? discountNode?.discount?.usageLimit
          : null,
      ),
      appliesOncePerCustomer: useField(
        discountNodeMethod === DiscountMethod.Code
          ? discountNode?.discount?.appliesOncePerCustomer
          : false,
      ),
      startDate: useField(discountNode?.discount?.startsAt ?? todaysDate),
      endDate: useField(discountNode?.discount?.endsAt ?? null),
      configuration: {
        buyX: useField(discountConfiguration?.buyX ?? "2"),
        getY: useField(discountConfiguration?.getY ?? "1"),
        // Add percentage configuration to form data
        percentage: useField(discountConfiguration?.percentage ?? "0"),
      },
    },
    onSubmit: async (form) => {
      const discount = {
        title: form.discountTitle,
        method: form.discountMethod,
        code: form.discountCode,
        combinesWith: form.combinesWith,
        usageLimit: form.usageLimit == null ? null : parseInt(form.usageLimit),
        appliesOncePerCustomer: form.appliesOncePerCustomer,
        startsAt: form.startDate,
        endsAt: form.endDate,
        configuration: {
          buyX: parseInt(form.configuration.buyX),
          getY: parseInt(form.configuration.getY),
          percentage: parseFloat(form.configuration.percentage),
        },
        metafield: {
          id: discountNode?.metafield?.id,
        },
      };

      console.log("DISCOUNT", discount);

      submitForm({ discount: JSON.stringify(discount) }, { method: "post" });

      return { status: "success" };
    },
  });

  const errorBanner =
    submitErrors.length > 0 ? (
      <Layout.Section>
        {/* @ts-ignore */}
        <Banner status="critical">
          <p>There were some issues with your form submission:</p>
          <ul>
            {submitErrors.map(
              (
                { message, field }: { message: string; field: string[] },
                index: number,
              ) => {
                return (
                  <li key={`${message}${index}`}>
                    {field.join(".")} {message}
                  </li>
                );
              },
            )}
          </ul>
        </Banner>
      </Layout.Section>
    ) : null;

  return (
    // Render a discount form using Polaris components and the discount app components
    <Page
      title="Edit buy x get y product discount"
      backAction={{
        content: "Discounts",
        onAction: () => open("shopify://admin/discounts", "_top"),
      }}
      primaryAction={{
        content: "Save",
        onAction: submit,
        loading: isLoading,
      }}
    >
      <Layout>
        {errorBanner}
        <Layout.Section>
          <Form method="post">
            {/* @ts-ignore */}
            <BlockStack align="space-around" gap="2">
              <MethodCard
                title="Type"
                discountTitle={discountTitle}
                discountClass={DiscountClass.Product}
                discountCode={discountCode}
                discountMethod={discountMethod}
              />
              {/* Collect data for the configuration metafield. */}
              <Card>
                {/* @ts-ignore */}
                <BlockStack gap="3">
                  <Text variant="headingMd" as="h2">
                    Configuration
                  </Text>
                  <TextField
                    label="Customer Buys (Buy X)"
                    autoComplete="on"
                    {...configuration.buyX}
                  />
                  <TextField
                    label="Customer Gets (Get Y)"
                    autoComplete="on"
                    {...configuration.getY}
                  />
                  <TextField
                    label="Discount percentage"
                    autoComplete="on"
                    {...configuration.percentage}
                    suffix="%"
                  />
                </BlockStack>
              </Card>
              {discountMethod.value === DiscountMethod.Code && (
                <UsageLimitsCard
                  totalUsageLimit={usageLimit as Field<string | null>}
                  oncePerCustomer={appliesOncePerCustomer}
                />
              )}
              <CombinationCard
                combinableDiscountTypes={combinesWith}
                discountClass={DiscountClass.Product}
                discountDescriptor={"Discount"}
              />
              <ActiveDatesCard
                startDate={startDate}
                endDate={endDate}
                timezoneAbbreviation="PST"
              />
            </BlockStack>
          </Form>
        </Layout.Section>
        {/* @ts-ignore */}
        <Layout.Section secondary>
          <SummaryCard
            header={{
              discountMethod: discountMethod.value,
              discountDescriptor:
                discountMethod.value === DiscountMethod.Automatic
                  ? discountTitle.value
                  : discountCode.value,
              appDiscountType: "Product",
              isEditing: false,
            }}
            performance={{
              status: DiscountStatus.Scheduled,
              usageCount: 0,
              // isEditing: false,
            }}
            minimumRequirements={{
              requirementType: requirementType.value,
              subtotal: requirementSubtotal.value,
              quantity: requirementQuantity.value,
              currencyCode: currencyCode,
            }}
            usageLimits={{
              oncePerCustomer: appliesOncePerCustomer.value,
              totalUsageLimit: usageLimit.value,
            }}
            activeDates={{
              // @ts-ignore
              startDate: startDate.value,
              endDate: endDate?.value,
            }}
          />
        </Layout.Section>
        <Layout.Section>
          <PageActions
            primaryAction={{
              content: "Save discount",
              onAction: submit,
              loading: isLoading,
            }}
            secondaryActions={[
              {
                content: "Discard",
                onAction: () => open("shopify://admin/discounts", "_top"),
              },
            ]}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
