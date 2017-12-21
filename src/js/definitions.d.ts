declare let DEV : boolean;

declare namespace Jason {

    interface Schema {
        definitions: any,
        properties: any,
    }

    interface TemplateSchemas {
        [category: string] : {
            [schema: string] : Schema
        }
    }
}

declare module "*.json" {
    const value: any;
    export default value;
}

declare module 'json-schemer' {
    export function prepareSchema(definitions: any, schemas: any): any;
}

declare module 'deepmerge' {
    export default function deepmerge(arg1: any, arg2: any): any;
}
