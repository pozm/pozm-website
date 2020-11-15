export const b = ""// so that it thinks that its a module
export declare module AdminData {

    export interface User {
        ID: number;
        Username: string;
        Password: string;
        PowerID: number;
        Email: string;
        RegisteredAT: string;
        Subscriptions?: any;
        RegisteredIP: string;
        LastIP: string;
        KEYID: string;
        AvatarUri?: any;
        password?: any;
        DiscordID : string,
        DiscordUser : string
        CreatedInvites? : number
        InvitedBy : string
    }

    export interface Key {
        KEYID: string;
        Registered: number;
        CreatedAT: string;
        RegisteredAT?: string;
        PowerID: number;
        CreatedBy:string;
    }

    export interface RootObject {
        users: User[];
        Keys: Key[];
    }

}

