import { createContext } from "react";

export type userType = {
    Username: string,
    ID:number,
    PowerID : number,
    Email : string,
    RegisteredAt: Date,
    Subscriptions: null | {},
    RegisteredIP : string,
    LastIP : string,
    KEYID: string
} | null

export default createContext<{user:userType,setUser:React.Dispatch<React.SetStateAction<userType>>}|null>(null)