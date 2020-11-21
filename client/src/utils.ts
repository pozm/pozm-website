export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r ? 0x3 : 0x8);
        return v.toString(16);
    });
}
export type PowerTypes = "user"|"cool"|"x"|"ADMIN"
export const PowerArray = ["user","friend","x","x","x","ADMIN"]
export function parsePowerId(u_id : string | number) {
    let id = Number(u_id)
    return PowerArray[id]
}
export function Clamp(n :number,min : number, max : number) {
    return Math.min(Math.max(n, min), max);
}
export function genRand(min : number, max : number) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
export const DiscordLinkUrl = "https://discord.com/api/oauth2/authorize?client_id=769669036514345002&redirect_uri=https%3A%2F%2Fwww.pozm.pw%2Fapi%2FlinkDiscord&response_type=code&scope=guilds.join%20identify"
export const fetcher = (url: RequestInfo, data: RequestInit | undefined) => fetch(url,{...data}).then(res => res.json())

export const ConvertTypeCol = (t : number) => {
    switch (t) {
        case 1:
            return "Normal"

    }
}