import { AppProvider } from "@shopify/discount-app-components";
import "@shopify/discount-app-components/build/esm/styles.css";

export function DiscountProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider locale="en-US" ianaTimezone="America/Los_Angeles">
      {children}
    </AppProvider>
  );
}
