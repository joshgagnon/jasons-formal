"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var formLoader_1 = require('./formLoader');
var moment = require('moment');
var header_1 = require('./header');
var modals_1 = require('./modals');
var momentLocalizer = require('react-widgets-moment');
momentLocalizer(moment);
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        _super.apply(this, arguments);
    }
    App.prototype.render = function () {
        return React.createElement("div", null, 
            React.createElement(header_1["default"], null), 
            React.createElement(formLoader_1["default"], {initialValues: { category: 'Evolution Templates', schema: 'letter' }}), 
            React.createElement(modals_1["default"], null));
    };
    return App;
}(React.PureComponent));
exports.App = App;
exports.__esModule = true;
exports["default"] = App;
