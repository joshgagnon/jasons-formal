/// <reference types="react" />
import * as React from "react";
import { InjectedFormProps } from 'redux-form';
export declare const required: (value: any) => string;
export declare class TemplateViews extends React.PureComponent<{
    category: string;
    schema: string;
    showPreview: () => void;
    showComplete: () => void;
    reset: (name: string, values: any) => void;
}> {
    render(): false | JSX.Element;
}
export declare const ToggleButtonFieldRow: any;
export declare const SelectFieldRow: any;
export declare const TextFieldRow: any;
export declare const TextAreaFieldRow: any;
export declare const DateFieldRow: any;
export declare const CheckboxFieldRow: any;
export declare class FormLoader extends React.PureComponent<InjectedFormProps> {
    render(): JSX.Element;
}
declare const _default: any;
export default _default;
