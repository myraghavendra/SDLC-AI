"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var body_parser_1 = require("body-parser");
var openai_1 = require("openai");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var app = (0, express_1.default)();
var port = 4000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
var openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
console.log('OpenAI API Key:', process.env.OPENAI_API_KEY);
app.post('/api/generate', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, description, context, prompt_1, completion, output, acceptanceCriteriaMatch, technicalNotesMatch, acceptanceCriteria, technicalNotes, error_1;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                _l.trys.push([0, 2, , 3]);
                _a = req.body, description = _a.description, context = _a.context;
                if (!description) {
                    return [2 /*return*/, res.status(400).json({ error: 'Description is required' })];
                }
                prompt_1 = "\nYou are a software development assistant.\n\nGiven the following user story description and optional context, generate:\n\n1. Acceptance Criteria in Gherkin syntax (Given, When, Then)\n2. Technical Notes detailing recommended technology stack for development\n\nUser Story Description:\n".concat(description, "\n\nContext:\n").concat(context || 'None', "\n\nOutput format:\nAcceptance Criteria:\n<gherkin syntax>\n\nTechnical Notes:\n<technology stack recommendations>\n");
                return [4 /*yield*/, openai.chat.completions.create({
                        model: 'gpt-4',
                        messages: [
                            { role: 'system', content: 'You are a helpful assistant.' },
                            { role: 'user', content: prompt_1 },
                        ],
                        max_tokens: 500,
                        temperature: 0.7,
                    })];
            case 1:
                completion = _l.sent();
                output = (_f = (_e = (_d = (_c = (_b = completion.choices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.trim()) !== null && _f !== void 0 ? _f : '';
                acceptanceCriteriaMatch = output.match(/Acceptance Criteria:(.*?)(Technical Notes:|$)/s);
                technicalNotesMatch = output.match(/Technical Notes:(.*)/s);
                acceptanceCriteria = (_h = (_g = acceptanceCriteriaMatch === null || acceptanceCriteriaMatch === void 0 ? void 0 : acceptanceCriteriaMatch[1]) === null || _g === void 0 ? void 0 : _g.trim()) !== null && _h !== void 0 ? _h : '';
                technicalNotes = (_k = (_j = technicalNotesMatch === null || technicalNotesMatch === void 0 ? void 0 : technicalNotesMatch[1]) === null || _j === void 0 ? void 0 : _j.trim()) !== null && _k !== void 0 ? _k : '';
                res.json({ acceptanceCriteria: acceptanceCriteria, technicalNotes: technicalNotes });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _l.sent();
                console.error('Error in /api/generate:', error_1);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () {
    console.log("Backend server listening at http://localhost:".concat(port));
});
