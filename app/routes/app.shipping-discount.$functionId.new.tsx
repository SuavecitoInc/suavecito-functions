import { useEffect, useMemo } from "react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useForm, useField } from "@shopify/react-form";
// import { useAppBridge } from "@shopify/app-bridge-react";
// import { Redirect } from "@shopify/app-bridge/actions";
import { CurrencyCode } from "@shopify/react-i18n";
import {
  Form,
  useActionData,
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

// It makes an admin GraphQL request to create a discount.
export const action = async ({ params, request }: ActionFunctionArgs) => {
  const { functionId } = params;
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
          mutation CreateCodeDiscount($discount: DiscountCodeAppInput!) {
            discountCreate: discountCodeAppCreate(codeAppDiscount: $discount) {
              userErrors {
                code
                message
                field
              }
            }
          }`,
      {
        variables: {
          discount: {
            ...baseCodeDiscount,
            metafields: [
              {
                namespace: "$app:shipping-discount",
                key: "function-configuration",
                type: "json",
                value: JSON.stringify({
                  percentage: configuration.percentage,
                  shipCountryCode: configuration.shipCountryCode,
                  minPurchaseAmount: configuration.minPurchaseAmount,
                }),
              },
            ],
          },
        },
      },
    );

    const responseJson = await response.json();
    const errors = responseJson.data.discountCreate?.userErrors;
    return json({ errors });
  } else {
    const response = await admin.graphql(
      `#graphql
          mutation CreateAutomaticDiscount($discount: DiscountAutomaticAppInput!) {
            discountCreate: discountAutomaticAppCreate(automaticAppDiscount: $discount) {
              userErrors {
                code
                message
                field
              }
            }
          }`,
      {
        variables: {
          discount: {
            ...baseDiscount,
            metafields: [
              {
                namespace: "$app:shipping-discount",
                key: "function-configuration",
                type: "json",
                value: JSON.stringify({
                  percentage: configuration.percentage,
                  shipCountryCode: configuration.shipCountryCode,
                  minPurchaseAmount: configuration.minPurchaseAmount,
                }),
              },
            ],
          },
        },
      },
    );

    const responseJson = await response.json();
    const errors = responseJson.data.discountCreate?.userErrors;
    return json({ errors });
  }
};

// This is the React component for the page.
export default function ShippingDiscountNew() {
  const submitForm = useSubmit();
  const actionData = useActionData<any>();
  const navigation = useNavigation();
  const todaysDate = useMemo(() => new Date(), []);

  const isLoading = navigation.state === "submitting";
  const currencyCode = CurrencyCode.Usd;
  const submitErrors = actionData?.errors || [];

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
      discountTitle: useField(""),
      discountMethod: useField(DiscountMethod.Code),
      discountCode: useField(""),
      combinesWith: useField({
        orderDiscounts: false,
        productDiscounts: false,
        shippingDiscounts: false,
      }),
      requirementType: useField(RequirementType.None),
      requirementSubtotal: useField("0"),
      requirementQuantity: useField("0"),
      usageLimit: useField(null),
      appliesOncePerCustomer: useField(false),
      startDate: useField(todaysDate),
      endDate: useField(null),
      configuration: {
        // Add quantity and percentage configuration to form data
        percentage: useField("0"),
        shipCountryCode: useField("US"),
        minPurchaseAmount: useField("0"),
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
          percentage: parseFloat(form.configuration.percentage),
          shipCountryCode: form.configuration.shipCountryCode,
          minPurchaseAmount: parseFloat(form.configuration.minPurchaseAmount),
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
      title="Create shipping discount"
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
                discountClass={DiscountClass.Shipping}
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
                    label="Discount percentage"
                    autoComplete="on"
                    {...configuration.percentage}
                    suffix="%"
                  />
                  <TextField
                    label="Shipping Country Code"
                    autoComplete="on"
                    {...configuration.shipCountryCode}
                  />
                  <TextField
                    label="Minimum purchase amount"
                    autoComplete="on"
                    {...configuration.minPurchaseAmount}
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
                discountClass={DiscountClass.Shipping}
                discountDescriptor={"Discount"}
              />
              <ActiveDatesCard
                // @ts-ignore
                startDate={startDate}
                // @ts-ignore
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
              appDiscountType: "Shipping",
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
