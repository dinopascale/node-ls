"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var path_1 = __importDefault(require("path"));
var app = express_1.default();
app.set('port', process.env.PORT || 3000);
app.set('views', path_1.default.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/', function (req, res) { return res.send('Hello'); });
exports.default = app;
