import { Banner, reactExtension } from "@shopify/ui-extensions-react/checkout";

export default reactExtension(
  "purchase.checkout.shipping-option-list.render-before",
  ({ settings }) => <Extension settings={settings} />,
);

function Extension({ settings }) {
  console.log("Extension settings", settings);

  return (
    <Banner
      title={settings.current.title}
      status={settings.current.status}
      collapsible={settings.current.collapsible}
    >
      {settings.current.description}
    </Banner>
  );
}
