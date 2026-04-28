"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var point_of_sale_1 = require("@shopify/ui-extensions-react/point-of-sale");
var Modal = function () {
    return ((0, jsx_runtime_1.jsx)(point_of_sale_1.Navigator, { children: (0, jsx_runtime_1.jsx)(point_of_sale_1.Screen, { name: "HelloWorld", title: "Hello World!", children: (0, jsx_runtime_1.jsx)(point_of_sale_1.ScrollView, { children: (0, jsx_runtime_1.jsx)(point_of_sale_1.Text, { children: "Welcome to the extension!" }) }) }) }));
};
exports.default = (0, point_of_sale_1.reactExtension)('pos.home.modal.render', function () { return (0, jsx_runtime_1.jsx)(Modal, {}); });
