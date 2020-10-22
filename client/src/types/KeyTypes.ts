export const b = ""// so that it thinks that its a module
declare module KeyData {

    export interface Key {
        KEYID: string;
        Registered: number;
        CreatedAT: Date;
        RegisteredAT?: Date;
        PowerID: number;
    }

    export interface RootObject {
        Keys: Key[];
    }

}

