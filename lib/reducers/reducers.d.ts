export declare const document: (state: Jason.DocumentState, action: any) => any;
export declare const dialogs: (state: Jason.DialogState, action: any) => Jason.DialogState | {
    showing: string;
    confirmation: any;
};
export declare const saved: (state: Jason.Saved, action: any) => any;
export declare const wizard: (state: Jason.Wizard, action: any) => Jason.Wizard;
