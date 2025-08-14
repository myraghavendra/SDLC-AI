"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
require("./Header.css");
const Header = () => {
    return ((0, jsx_runtime_1.jsxs)("header", { className: "header", children: [(0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/", className: "logo", children: ['<>', " SDLC Agent"] }), (0, jsx_runtime_1.jsxs)("nav", { className: "nav-links", children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", children: "HOME" }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/features", children: "FEATURES" }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/documentation", children: "DOCUMENTATION" })] })] }));
};
exports.default = Header;
