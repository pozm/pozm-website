import { createContext } from "react";

export type userType = {
    Username: string,
    ID:number,
    PowerID : number,
    Email : string,
    RegisteredAT: string,
    Subscriptions: null | {},
    RegisteredIP : string,
    LastIP : string,
    KEYID: string,
    AvatarUri : string
} | null

export default createContext<{user:userType,setUser:React.Dispatch<React.SetStateAction<userType>>}|null>(null)