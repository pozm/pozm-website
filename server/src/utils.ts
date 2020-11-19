import {MysqlError, OkPacket} from "mysql"
import { con } from "."

async function getIdFromUser (user:number) {

    return new Promise(res => {

        con.query('select id from `whitelist`.`account` where Username = ?',user, (err, res2) => {

            if (err) throw err
            if (0 in res2) return res( res2[0].id)
            res(false)
        })

    })

}

async function getDataFromId (id:string) {
    if (!id) return null;
    return new Promise(res => {
        
        con.query('select *, NULL AS Password from `whitelist`.`account` where ID = ?',id, (err, res2) => {
            
            if (err) throw err
            if (0 in res2) {
                return res( res2[0])
            }
            res(null)
        })
        
            
    })
        
}

export async function getCreatedKeysFromId(id:string) {
    return (await AsyncQuery<{[x:string]:number}[]>(`select count(*) from whitelist.keycode where CreatedBy = ?`,[id]) ?? [{}])[0]['count(*)'] ?? 0
}

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function AsyncQuery<T>(query : string,args?:any[], HandleError: (err:MysqlError) => void= (err)=>{} ) : Promise<(T|null)> {
    return new Promise(resolve => {
        
        let func = (err:MysqlError|null,result:any)=>{
            
            if (err) return HandleError(err)
            return resolve(result)
            
        }
        con.query(query,args ?? func, func)
        
    })
    
}

export async function CheckIfKeyExists(KeyId : string) {
    let exists = await AsyncQuery<{[any:string]:number}[]>('select exists( select * from `whitelist`.keycode where KEYID = ? )', [ KeyId])
    if (!exists) return false;
    return Object.values(exists[0])[0]
}
export function GetType() {
    return process.argv[2] == "prod"
}

export interface UserType {
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
    DiscordUser : string,
    InvitedBy : string
}

export {getIdFromUser,AsyncQuery,getDataFromId}