"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var point_of_sale_1 = require("@shopify/ui-extensions-react/point-of-sale");
var react_1 = require("react");
var TileComponent = function () {
    var api = (0, point_of_sale_1.useApi)();
    var cart = (0, point_of_sale_1.useCartSubscription)();
    (0, react_1.useEffect)(function () {
        var injectSource = function () {
            var _a;
            var alreadyTagged = ((_a = cart.properties) === null || _a === void 0 ? void 0 : _a._source) === "pos";
            if (!alreadyTagged) {
                api.cart.addCartProperties({ _source: "pos" }).catch(function () { });
            }
        };
        injectSource();
    }, [api.cart, cart.properties]);
    // Invisible tile — no UI, just background logic
    return ((0, jsx_runtime_1.jsx)(point_of_sale_1.Tile, { title: "Source Tagger", subtitle: "System \u2014 do not remove", onPress: function () { }, enabled: false }));
};
exports.default = (0, point_of_sale_1.reactExtension)("pos.home.tile.render", function () {
    return (0, jsx_runtime_1.jsx)(TileComponent, {});
});
