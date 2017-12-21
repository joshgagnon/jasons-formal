declare let DEV : boolean;

declare namespace Jason {

    interface SchemaProperties {
        title?: string
    }

    interface Schema {
        title?: string;
        description?: string;
        definitions: any,
        properties: SchemaProperties & any,
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
