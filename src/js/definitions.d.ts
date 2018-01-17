declare let DEV : boolean;

declare namespace Jason {

    interface SchemaProperties {
        title?: string,
    }

    interface Schema {
        title?: string;
        description?: string;
        definitions: any,
        properties: SchemaProperties & any,
        oneOf?: any[]
    }

    interface TemplateSchemas {
        [category: string] : {
            [schema: string] : Schema
        }
    }

    interface State {

    }
}

declare module "*.json" {
    const value: any;
    export default value;
}

declare module 'json-schemer' {
    export function prepareSchema(definitions: any, schemas: any): any;
    export function componentType(object: any): string;
    export function getKey(): string;
    export function addItem(field: any): string;
}

declare module 'deepmerge' {
    export default function deepmerge(arg1: any, arg2: any): any;
}
