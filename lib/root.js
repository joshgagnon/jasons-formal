"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_redux_1 = require("react-redux");
var routes_1 = require("./routes");
var react_router_1 = require("react-router");
require("../style/style.scss");
var Root = /** @class */ (function (_super) {
    __extends(Root, _super);
    function Root() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Root.prototype.render = function () {
        return (React.createElement(react_redux_1.Provider, { store: this.props.store },
            React.createElement(react_router_1.Router, { history: this.props.history },
                routes_1.default(),
                this.props.children)));
    };
    return Root;
}(React.PureComponent));
exports.default = Root;
//# sourceMappingURL=root.js.map