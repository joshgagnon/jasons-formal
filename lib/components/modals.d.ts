/// <reference types="react" />
import * as React from "react";
import { Button } from 'react-bootstrap';
import { InjectedFormProps } from 'redux-form';
export declare class SaveModal extends React.PureComponent<{
    saveMode: boolean;
    handleClose: () => void;
    loading: boolean;
    entries: [Jason.SavedItemSummary];
    courtCostsValues: any;
    request: () => void;
    save: (args: Jason.Actions.SaveStatePayload) => void;
    overwrite: (args: Jason.Actions.SaveStatePayload) => void;
    deleteEntry: (args: Jason.Actions.DeleteStatePayload) => void;
    load: (args: Jason.Actions.LoadStatePayload) => void;
} & InjectedFormProps> {
    componentWillMount(): void;
    save(values: any): void;
    deleteItem(e: React.MouseEvent<Button>, saved_id: number): void;
    handleClick(item: Jason.SavedItemSummary): void;
    render(): JSX.Element;
}
export interface ConfirmationProps extends Jason.Confirmation {
    hide: () => void;
    accept: () => void;
    reject: () => void;
}
export declare class ConfirmationDialog extends React.PureComponent<ConfirmationProps> {
    render(): JSX.Element;
}
export interface RestoreProps {
    handleClose: () => void;
    setForm: (name: string, args: any) => void;
}
export declare class Restore extends React.PureComponent<RestoreProps> {
    constructor(props: RestoreProps);
    handleNo(): void;
    handleRestore(): void;
    render(): JSX.Element;
}
export declare class PreviewModal extends React.PureComponent<{
    handleClose: () => void;
}> {
    render(): JSX.Element;
}
export declare class FileFormat extends React.PureComponent<{
    fileFormatExtras?: React.ComponentClass;
    getFileValues: () => any;
}> {
    render(): JSX.Element;
}
export declare class Complete extends React.PureComponent<{
    handleClose: () => void;
    schemaName: string;
    category: string;
    getValues: () => any;
    getFileValues: () => any;
    download: (data: any) => void;
    fileFormatExtras?: React.ComponentClass;
}> {
    constructor(props: any);
    download(): void;
    render(): JSX.Element;
}
export declare class Modals extends React.PureComponent<{
    downloading: boolean;
    showing: string;
    fileFormatExtras?: React.ComponentClass;
}> {
    render(): false | JSX.Element;
}
declare const ConnectedModals: any;
export default ConnectedModals;
