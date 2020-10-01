import { MysqlError } from "mysql"
import { con } from "."

async function getIdFromUser (user:number) {

    return new Promise(res => {

        con.query('select id from `whitelist`.`account` where Username = ?',user, (err, res2) => {

            if (err) throw err
            if (0 in res2) return res( res2[0].ID)
            res(false)
        })

    })

}

async function getDataFromId (id:string) {
    if (!id) return null;
    return new Promise(res => {
        
        con.query('select *, NULL AS password from `whitelist`.`account` where ID = ?',id, (err, res2) => {
            
            if (err) throw err
            if (0 in res2) {
                return res( res2[0])
            }
            res(null)
        })
        
            
    })
        
}

async function AsyncQuery<T>(query : string,args:any[]) : Promise<(T|null)[]> {
    return new Promise(resolve => {
        
        let func = (err:MysqlError|null,result:any)=>{
            
            if (err) throw err
            return resolve(result)
            
        }
        con.query(query,args ?? func, func)
        
    })
    
}


export {getIdFromUser,AsyncQuery,getDataFromId}