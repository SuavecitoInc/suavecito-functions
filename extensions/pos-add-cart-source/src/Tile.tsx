import {
  Tile,
  reactExtension,
  useApi,
  useCartSubscription,
} from "@shopify/ui-extensions-react/point-of-sale";
import { useEffect } from "react";

const TileComponent = () => {
  const api = useApi<"pos.home.tile.render">();
  const cart = useCartSubscription();

  useEffect(() => {
    const injectSource = () => {
      const alreadyTagged = cart.properties?._source === "pos";
      if (!alreadyTagged) {
        api.cart.addCartProperties({ _source: "pos" }).catch(() => {});
      }
    };

    injectSource();
  }, [api.cart, cart.properties]);

  // Invisible tile — no UI, just background logic
  return (
    <Tile
      title="Source Tagger"
      subtitle="System — do not remove"
      onPress={() => {}}
      enabled={false}
    />
  );
};

export default reactExtension("pos.home.tile.render", () => {
  return <TileComponent />;
});
