"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./FeatureCard.css");
const react_router_dom_1 = require("react-router-dom");
const FeatureCard = ({ icon, title, description, className, to }) => {
    const content = ((0, jsx_runtime_1.jsxs)("div", { className: `feature-card${className ? ' ' + className : ''}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "icon", children: icon }), (0, jsx_runtime_1.jsx)("h3", { className: "title", children: title }), (0, jsx_runtime_1.jsx)("div", { className: "description", children: description })] }));
    if (to) {
        return (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: to, children: content });
    }
    return content;
};
exports.default = FeatureCard;
