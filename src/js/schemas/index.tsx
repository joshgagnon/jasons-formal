import { prepareSchema } from 'json-schemer';
import merge from 'deepmerge';
const gc = require.context('good-companies-templates/schemas');

function loadAll(context: any) : {[key: string] : any}{
    const definitions = context('./definitions');
    return context.keys().reduce((acc: any, key: string) => {
        if(context(key) !== definitions && key.indexOf('.json') === -1){
            try{
                acc[key.replace('./', '')] = prepareSchema(definitions, context(key)) as any;
            }
            catch(e){
                console.log('could not load schema: ', key)
            }
        }
        return acc;
    }, {});
}



const templateSchemas = {
    'Good Companies': loadAll(gc)
}

export default templateSchemas;
