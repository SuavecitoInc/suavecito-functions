import { useState, useEffect, useCallback } from "react";
import {
  Banner,
  Card,
  FormLayout,
  Layout,
  Page,
  TextField,
  Select,
  Divider,
} from "@shopify/polaris";
import {
  Form,
  useActionData,
  useNavigation,
  useSubmit,
  useLoaderData,
} from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { functionId, id } = params;
  const { admin } = await authenticate.admin(request);

  if (id != "new") {
    const gid = `gid://shopify/DeliveryCustomization/${id}`;

    const response = await admin.graphql(
      `#graphql
        query getDeliveryCustomization($id: ID!) {
          deliveryCustomization(id: $id) {
            id
            title
            enabled
            metafield(namespace: "$app:delivery-option-hide", key: "function-configuration") {
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

    const responseJson = await response.json();
    const deliveryCustomization = responseJson.data.deliveryCustomization;
    const metafieldValue = JSON.parse(deliveryCustomization.metafield.value);

    return {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customPropKey: metafieldValue?.customPropKey,
        customPropType: metafieldValue?.customPropType,
        shipOptionTitleMatch: metafieldValue?.shipOptionTitleMatch,
      }),
    };
  }

  return {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      stateProvinceCode: "",
      message: "",
    }),
  };
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const { functionId, id } = params;
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const customPropKey = formData.get("customPropKey");
  const customPropType = formData.get("customPropType");
  const shipOptionTitleMatch = formData.get("shipOptionTitleMatch");

  const t = {
    line_item: {
      name: "Line Item",
      type: "Custom Property",
    },
    cart: {
      name: "Cart",
      type: "Attribute",
    },
  };
  // @ts-expect-error
  const title = `Hide Ship Option: Change ${t[customPropType]?.name} ${t[customPropType]?.type} | Match: ${shipOptionTitleMatch}`;

  const deliveryCustomizationInput = {
    functionId,
    title,
    enabled: true,
    metafields: [
      {
        namespace: "$app:delivery-option-hide",
        key: "function-configuration",
        type: "json",
        value: JSON.stringify({
          customPropKey,
          customPropType,
          shipOptionTitleMatch,
        }),
      },
    ],
  };

  if (id != "new") {
    const response = await admin.graphql(
      `#graphql
        mutation updateDeliveryCustomization($id: ID!, $input: DeliveryCustomizationInput!) {
          deliveryCustomizationUpdate(id: $id, deliveryCustomization: $input) {
            deliveryCustomization {
              id
            }
            userErrors {
              message
            }
          }
        }`,
      {
        variables: {
          id: `gid://shopify/DeliveryCustomization/${id}`,
          input: deliveryCustomizationInput,
        },
      },
    );

    const responseJson = await response.json();
    const errors = responseJson.data.deliveryCustomizationUpdate?.userErrors;

    return json({ errors });
  } else {
    const response = await admin.graphql(
      `#graphql
        mutation createDeliveryCustomization($input: DeliveryCustomizationInput!) {
          deliveryCustomizationCreate(deliveryCustomization: $input) {
            deliveryCustomization {
              id
            }
            userErrors {
              message
            }
          }
        }`,
      {
        variables: {
          input: deliveryCustomizationInput,
        },
      },
    );

    const responseJson = await response.json();
    const errors = responseJson.data.deliveryCustomizationCreate?.userErrors;

    return json({ errors });
  }
};

export default function DeliveryCustomization() {
  const submit = useSubmit();
  const actionData = useActionData<any>();
  const navigation = useNavigation();
  const loaderData = useLoaderData<any>();

  const defaultType = loaderData?.customPropType ?? "line_item";

  const [customPropKey, setCustomPropKey] = useState(loaderData.customPropKey);
  const [customPropType, setCustomPropType] = useState(defaultType);
  const [shipOptionTitleMatch, setShipOptionTitleMatch] = useState(
    loaderData.shipOptionTitleMatch,
  );

  const options = [
    { label: "Select a type", value: "" },
    { label: "Line Item", value: "line_item" },
    { label: "Cart", value: "cart" },
  ];

  useEffect(() => {
    if (loaderData) {
      const parsedData = JSON.parse(loaderData.body);
      setCustomPropKey(parsedData.customPropKey);
      setCustomPropType(parsedData.customPropType);
      setShipOptionTitleMatch(parsedData.shipOptionTitleMatch);
    }
  }, [loaderData]);

  const isLoading = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.errors.length === 0) {
      open("shopify:admin/settings/shipping/customizations", "_top");
    }
  }, [actionData?.errors]);

  const errorBanner = actionData?.errors.length ? (
    <Layout.Section>
      <Banner
        title="There was an error creating the customization."
        // @ts-expect-error
        status="critical"
      >
        <ul>
          {actionData?.errors.map((error: any, index: number) => {
            return <li key={`${index}`}>{error.message}</li>;
          })}
        </ul>
      </Banner>
    </Layout.Section>
  ) : null;

  const handleSubmit = () => {
    submit(
      { customPropType, customPropKey, shipOptionTitleMatch },
      { method: "post" },
    );
  };

  const handleSelectChange = useCallback(
    (value: string) => setCustomPropType(value),
    [],
  );

  return (
    <Page
      title="Hide Ship Option"
      backAction={{
        content: "Delivery customizations",
        onAction: () =>
          open("shopify:admin/settings/shipping/customizations", "_top"),
      }}
      primaryAction={{
        content: "Save",
        loading: isLoading,
        onAction: handleSubmit,
      }}
    >
      <Layout>
        {errorBanner}
        <Layout.Section>
          <Card>
            <Form method="post">
              <div style={{ marginBottom: 10 }}>
                <p>
                  This function hides a <i>Delivery Option</i>. Select the
                  custom prop match type, value, and the ship option title to
                  match below.
                </p>
                <div style={{ margin: 10 }}>
                  <Divider />
                </div>
              </div>
              <FormLayout>
                <FormLayout.Group>
                  <Select
                    label="Custom Property / Attribute Type"
                    options={options}
                    onChange={handleSelectChange}
                    name="customPropType"
                    value={customPropType}
                  />
                  <TextField
                    name="customPropKey"
                    type="text"
                    label="Custom Property / Attribute Value"
                    value={customPropKey}
                    onChange={setCustomPropKey}
                    disabled={isLoading}
                    requiredIndicator
                    autoComplete="off"
                  />
                  <TextField
                    name="shipOptionTitleMatch"
                    type="text"
                    label="Ship Option Title Match"
                    value={shipOptionTitleMatch}
                    onChange={setShipOptionTitleMatch}
                    disabled={isLoading}
                    requiredIndicator
                    autoComplete="on"
                  />
                </FormLayout.Group>
              </FormLayout>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
