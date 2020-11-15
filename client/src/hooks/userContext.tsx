import { createContext } from "react";

export type userType = {
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
} | null

export default createContext<{user:userType,setUser:React.Dispatch<React.SetStateAction<userType>>}|null>(null)