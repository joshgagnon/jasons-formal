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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var redux_form_1 = require("redux-form");
var react_redux_1 = require("react-redux");
var schemas_1 = require("../schemas");
var actions_1 = require("../actions");
var react_pdf_1 = require("react-pdf-component/lib/react-pdf");
var loading_1 = require("./loading");
function buildRenderObject(filename, category, schemaName, values, metadata) {
    if (metadata === void 0) { metadata = {}; }
    var type = schemas_1.default[category].schemas[schemaName];
    var schema = type.schema;
    return {
        formName: schema.formName,
        templateTitle: schema.title,
        values: __assign({}, values, { filename: filename }),
        metadata: metadata,
        env: schemas_1.default[category].name
    };
}
exports.buildRenderObject = buildRenderObject;
var UnconnectedPDFPreview = /** @class */ (function (_super) {
    __extends(UnconnectedPDFPreview, _super);
    function UnconnectedPDFPreview() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UnconnectedPDFPreview.prototype.render = function () {
        if (this.props.downloadStatus === 1 /* InProgress */)
            return React.createElement(loading_1.default, null);
        if (this.props.downloadStatus === 3 /* Failed */)
            return React.createElement("div", { className: "alert alert-danger" }, "Could not generate document");
        if (this.props.downloadStatus === 2 /* Complete */)
            return React.createElement(react_pdf_1.default, { data: this.props.data, scale: 2.5, noPDFMsg: ' ' });
        return false;
    };
    return UnconnectedPDFPreview;
}(React.PureComponent));
exports.UnconnectedPDFPreview = UnconnectedPDFPreview;
var PDFPreview = react_redux_1.connect(function (state, ownProps) { return ({
    data: state.document.data,
    downloadStatus: state.document.downloadStatus
}); })(UnconnectedPDFPreview);
var UnconnectedPreview = /** @class */ (function (_super) {
    __extends(UnconnectedPreview, _super);
    function UnconnectedPreview() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UnconnectedPreview.prototype.buildRenderObject = function (values, metadata) {
        if (metadata === void 0) { metadata = {}; }
        var type = schemas_1.default[this.props.category].schemas[this.props.schemaName];
        return buildRenderObject(type.schema.title, this.props.category, this.props.schemaName, values, metadata);
    };
    UnconnectedPreview.prototype.componentWillMount = function () {
        var values = this.props.getValues();
        this.props.render({ data: this.buildRenderObject(values) });
    };
    UnconnectedPreview.prototype.render = function () {
        return React.createElement("div", { className: "preview" },
            React.createElement(PDFPreview, null));
    };
    return UnconnectedPreview;
}(React.PureComponent));
exports.UnconnectedPreview = UnconnectedPreview;
//formValues<any>('category', 'schema')(TemplateViews) as any)
exports.Preview = react_redux_1.connect(function (state, ownProps) {
    var formLoader = redux_form_1.getFormValues('formLoader')(state);
    return {
        schemaName: formLoader.schema,
        category: formLoader.category,
        getValues: function () { return redux_form_1.getFormValues(formLoader.category + "." + formLoader.schema)(state); }
    };
}, {
    render: actions_1.render,
})(UnconnectedPreview);
//# sourceMappingURL=preview.js.map