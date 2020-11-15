import { createContext } from "react";
import {AdminData} from "../types/adminTypes";


export default createContext<{user:AdminData.User,setUser:React.Dispatch<React.SetStateAction<AdminData.User>>}|null>(null)