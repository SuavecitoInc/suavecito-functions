import { useCallback, useEffect, useMemo, useState } from "react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useForm, useField } from "@shopify/react-form";
// import { useAppBridge } from "@shopify/app-bridge-react";
// import { Redirect } from "@shopify/app-bridge/actions";
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
  Select,
} from "@shopify/polaris";

import shopify from "../shopify.server";
import CollectionSelect from "~/components/CollectionSelect";

export const loader = async ({ params, request }: ActionFunctionArgs) => {
  // const { functionId } = params;
  const { admin } = await shopify.authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
      query GetCollections {
        collections(first: 250) {
          edges {
            node {
              id
              title
            }
          }
        }
      }`,
  );

  const responseJson = await response.json();

  console.log("RESPONSE JSON", responseJson);
  if (!responseJson.data) {
    console.error("Error fetching collections");
    // Return an empty collections array to avoid breaking the UI
    return json({ collections: { edges: [] } });
  }

  return json({ collections: responseJson.data.collections });
};

// This is a server-side action that is invoked when the form is submitted.
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
                namespace: "$app:product-discount",
                key: "function-configuration",
                type: "json",
                value: JSON.stringify({
                  quantity: configuration.quantity,
                  percentage: configuration.percentage,
                  excludedSkus: configuration.excludedSkus,
                  excludedVendors: configuration.excludedVendors,
                  includeProductsInCollections:
                    configuration.includeProductsInCollections,
                }),
              },
              {
                namespace: "$app:product-discount",
                key: "selected-collections",
                type: "json",
                value: JSON.stringify({
                  selectedCollectionIds: configuration.collections,
                }),
              },
            ],
          },
        },
      },
    );

    const responseJson = await response.json();
    if (!responseJson.data) {
      console.error("Error creating code discount");
      return json({ errors: "Something went wrong" });
    }
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
                namespace: "$app:product-discount",
                key: "function-configuration",
                type: "json",
                value: JSON.stringify({
                  quantity: configuration.quantity,
                  percentage: configuration.percentage,
                  excludedSkus: configuration.excludedSkus,
                  excludedVendors: configuration.excludedVendors,
                  includeProductsInCollections:
                    configuration.includeProductsInCollections,
                }),
              },
              {
                namespace: "$app:product-discount",
                key: "selected-collections",
                type: "json",
                value: JSON.stringify({
                  selectedCollectionIds: configuration.collections,
                }),
              },
            ],
          },
        },
      },
    );

    const responseJson = await response.json();
    if (!responseJson.data) {
      console.error("Error creating automatic discount");
      return json({ errors: "Something went wrong" });
    }
    const errors = responseJson.data.discountCreate?.userErrors;
    return json({ errors });
  }
};

// This is the React component for the page.
export default function ProductDiscountNew() {
  const submitForm = useSubmit();
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<any>();
  const navigation = useNavigation();
  const todaysDate = useMemo(() => new Date(), []);

  const isLoading = navigation.state === "submitting";
  const currencyCode = CurrencyCode.Usd;
  const submitErrors = actionData?.errors || [];

  console.log("LOADER DATA", loaderData.collections.edges);

  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

  // select options
  const [selected, setSelected] = useState("exclude");

  const handleSelectChange = useCallback(
    (value: string) => setSelected(value),
    [],
  );

  const options = [
    { label: "Exclude", value: "exclude" },
    { label: "Include", value: "include" },
  ];

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
        quantity: useField("1"),
        percentage: useField("0"),
        excludedSkus: useField(""),
        excludedVendors: useField(""),
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
          quantity: parseInt(form.configuration.quantity),
          percentage: parseFloat(form.configuration.percentage),
          excludedSkus: form.configuration.excludedSkus
            .split(",")
            .map((sku: string) => sku.trim()),
          excludedVendors: form.configuration.excludedVendors
            .split(",")
            .map((vendor: string) => vendor.trim()),
          collections: selectedCollections,
          includeProductsInCollections: selected === "include",
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
      title="Create product discount"
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
                    label="Minimum quantity"
                    autoComplete="on"
                    {...configuration.quantity}
                  />
                  <TextField
                    label="Discount percentage"
                    autoComplete="on"
                    {...configuration.percentage}
                    suffix="%"
                  />
                  <TextField
                    label="Excluded SKUs (comma separated)"
                    autoComplete="on"
                    {...configuration.excludedSkus}
                  />
                  <TextField
                    label="Excluded Vendors (comma separated)"
                    autoComplete="on"
                    {...configuration.excludedVendors}
                  />
                  <Select
                    label="Include or Exclude Products in Collections"
                    options={options}
                    onChange={handleSelectChange}
                    value={selected}
                  />
                  <label>Select collections to include in discount</label>
                  <CollectionSelect
                    collections={loaderData.collections.edges}
                    selectedOptions={selectedCollections}
                    setSelectedOptions={setSelectedCollections}
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
