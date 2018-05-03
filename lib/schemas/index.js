"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var json_schemer_1 = require("json-schemer");
var schemas = require.context('el-templates/schemas');
var gc = require.context('good-companies-templates/schemas');
function loadAll(context) {
    var definitions;
    try {
        definitions = context('./definitions');
    }
    catch (e) {
        definitions = {};
    }
    return context.keys().reduce(function (acc, key) {
        if (context(key) !== definitions && key.indexOf('.json') === -1) {
            try {
                var schema_1 = json_schemer_1.prepareSchema(definitions, context(key));
                var validate = json_schemer_1.getValidate(schema_1);
                var validatePages = schema_1.wizard ? schema_1.wizard.steps.map(function (item, index) {
                    return json_schemer_1.getValidate(json_schemer_1.getSubSchema(schema_1, index));
                }) : [];
                acc[key.replace('./', '')] = {
                    schema: schema_1,
                    validate: validate,
                    validatePages: validatePages
                };
            }
            catch (e) {
                console.log('could not load schema: ', key);
            }
        }
        return acc;
    }, {});
}
var templateSchemas = {
    'Evolution Templates': {
        schemas: loadAll(schemas),
        name: 'el'
    },
    'Good Companies': {
        schemas: loadAll(gc),
        name: 'gc'
    }
};
console.log(templateSchemas);
exports.default = templateSchemas;
//# sourceMappingURL=index.js.map