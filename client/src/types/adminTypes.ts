export const b = ""// so that it thinks that its a module
export namespace AdminData {

    export interface User {
        ID: number;
        Username: string;
        Password: string;
        PowerID: number;
        Email: string;
        RegisteredAT: Date;
        Subscriptions?: any;
        RegisteredIP: string;
        LastIP: string;
        KEYID: string;
    }

    export interface RootObject {
        users: User[];
    }
}