declare let DEV : boolean;

declare namespace Jason {

    const enum DownloadStatus {
        NotStarted,
        InProgress,
        Complete,
        Failed
    }

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



declare namespace Jason.Actions {
    const enum Types {
        RENDER = 'RENDER',
        UPDATE_RENDER = 'UPDATE_RENDER',
    }

    interface ActionCreator<T> {
        type: Jason.Actions.Types;
        payload: T;
    }

    interface Action {
        type: Jason.Actions.Types;
    }

    interface RenderPayload {
        data: any
    }

    interface Render extends ActionCreator<RenderPayload> {}

    interface UpdateRenderPayload {
        downloadStatus: Jason.DownloadStatus
        data?: any
    }

    interface UpdateRender extends ActionCreator<UpdateRenderPayload> {}

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
    export function setDefaults(schema: Jason.Schema, context: any, values: any): any;
}

declare module 'deepmerge' {
    export default function deepmerge(arg1: any, arg2: any): any;
}
