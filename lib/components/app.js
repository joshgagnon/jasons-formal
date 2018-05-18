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
var formLoader_1 = require("./formLoader");
var moment = require("moment");
var header_1 = require("./header");
var modals_1 = require("./modals");
var momentLocalizer = require("react-widgets-moment");
momentLocalizer(moment);
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    App.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement(header_1.default, null),
            React.createElement(formLoader_1.default, { initialValues: { category: 'Evolution Templates', schema: 'letter' }, context: { 'users': [{ 'title': 'xx', 'value': { 'firstName': 'x', email: 'asdf' } }, { 'title': 'yy', 'value': { 'firstName': 'y', email: 'asdfasdfa' } }],
                    'recipients.individuals': [{ "id": 1, "organisation_id": 1, "recipientType": "individuals", "firstName": "asdfasdf", "email": "asdfasdf@asdfads.com", "phone": "asdf", "created_at": "2018-05-02 04:29:32", "updated_at": "2018-05-02 04:29:32", "deleted_at": null, "addresses": [{ "id": 5, "address_name": "zzzz", "address_one": "z", "address_two": null, "city": null, "address_type": "z", "post_code": "z", "country": "z", "county": null, "state": null }, { "id": 6, "address_name": "aaa", "address_one": "a", "address_two": null, "city": null, "address_type": "a", "post_code": "a", "country": "a", "county": null, "state": null }] }]
                        .map(function (recipient) {
                        return { value: recipient, title: recipient.firstName };
                    })
                } }),
            React.createElement(modals_1.default, null));
    };
    return App;
}(React.PureComponent));
exports.App = App;
exports.default = App;
//# sourceMappingURL=app.js.map