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
var Fade_1 = require("react-bootstrap/lib/Fade");
var react_overlays_1 = require("react-overlays");
var Loading = /** @class */ (function (_super) {
    __extends(Loading, _super);
    function Loading() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Loading.prototype.render = function () {
        return React.createElement("div", { className: 'loading' });
    };
    return Loading;
}(React.PureComponent));
exports.default = Loading;
function LoadingOverlay(props) {
    var animationTime = props.animationTime;
    if (props.animationTime === undefined) {
        animationTime = 200;
    }
    return React.createElement(react_overlays_1.Modal, { show: true, backdrop: true, className: "basic-modal", backdropClassName: "modal-backdrop", transition: animationTime ? Fade_1.default : null, keyboard: false },
        React.createElement("div", { className: "loading-modal" },
            React.createElement("div", { className: "message" }, props.message || 'Loading'),
            React.createElement(Loading, null)));
}
exports.LoadingOverlay = LoadingOverlay;
//# sourceMappingURL=loading.js.map