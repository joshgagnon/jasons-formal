import { prepareSchema, getValidate, getSubSchema } from 'json-schemer';
import merge from 'deepmerge';
const schemas = require.context('el-templates/schemas');
const gc = require.context('good-companies-templates/schemas');

function loadAll(context: any) : {[key: string] : any}{
    let definitions : any;
    try{
        definitions = context('./definitions');
    } catch(e) {
        definitions = {};
    }
    return context.keys().reduce((acc: any, key: string) => {
        if(context(key) !== definitions && key.indexOf('.json') === -1){
            try{
                const schema = prepareSchema(definitions, context(key)) as Jason.Schema;
                const validate = getValidate(schema);
                const validatePages = schema.wizard ? schema.wizard.steps.map((item: any, index: number) => {
                    return getValidate(getSubSchema(schema, index));
                }) : [];
                acc[key.replace('./', '')] = {
                    schema,
                    validate,
                    validatePages
                }
            }
            catch(e){
                console.log('could not load schema: ', key)
            }
        }
        return acc;
    }, {});
}



const templateSchemas : Jason.TemplateSchemas = {
    'Evolution Templates': {
        schemas: loadAll(schemas),
        name: 'el'
    },
    'Good Companies': {
        schemas: loadAll(gc),
        name: 'gc'
    }
}

export default templateSchemas;
