"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_2 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
require("./index.css");
const react_router_dom_2 = require("react-router-dom");
client_1.default.createRoot(document.getElementById('root')).render((0, jsx_runtime_2.jsx)(react_1.default.StrictMode, { children: (0, jsx_runtime_2.jsx)(react_router_dom_2.BrowserRouter, { children: (0, jsx_runtime_2.jsx)(App, {}) }) }));
