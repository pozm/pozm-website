import React, { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Product, RootObject } from "../types/stockAPI";
// import data from "../JSON-Data/h.json"
type Props= {
    
};

function FormatString(str :string , formatter : {name : string, value:string}[] ) :string {
    let NewStr = str
    for (let obj of formatter) {
        NewStr = NewStr.replace(`{${obj.name}}`,obj.value)
    }
    return NewStr
}

export const ProductAPI = "https://api-prod.nvidia.com/direct-sales-shop/DR/products/{locale}/{currency}/{sku}"

export interface KnownLocales {
    ["en-gb"] : string
    ["en-us"] : string
}

export interface KnownGPUs {
    [x:string]: KnownLocales
    ["3080"] : KnownLocales
    ["3090"] : KnownLocales
}

export const localeCurrency = {
    "en-gb" : "GBP",
    "en-us" : "USD"
}

export const localeMap : KnownGPUs = {
    "3080": {
        "en-us":"5438481700",
        "en-gb":"5438792800"
    },
    "3090": {
        "en-gb" : "5438792700",
        "en-us" : "5438481600" 
    }
}


export const RtxC: React.FC<Props> = (props) => {
    let loc = useLocation()
    let m : Map<string,Product|string> = new Map
    useMemo(()=>{

        let locale = (window.navigator.language.toLowerCase()) as keyof KnownLocales
        for (let card of Object.keys(localeMap)) {
            let sku = localeMap[card][locale]
            let curr = localeCurrency[locale]
            let URI = FormatString(ProductAPI,[{name:"locale",value:locale.replace('-','_')},{name:"currency",value:curr},{name:"sku",value:sku}])
            console.log(URI)
            fetch(URI, {
                mode:"no-cors"
            }).then( (value)=>{

                console.log("aaaaa")

                if (value.ok) {
                    value.json().then((v : RootObject) => {
                        if (v?.products) {

                            console.log("passed")

                            m.set(card,v.products.product[0])

                        }
                    })
                } else {
                    m.set(card,"off sale")
                }

            } , e => {
                console.log("no")
            } )
        }
    },[])
    const getData = useCallback(( t : keyof KnownGPUs)=>{
        console.log("called!")
        let data = m.get(t as string)
        if (typeof data === "string") {
            return data
        } else {
            return data?.inventoryStatus.status
        }
    },[m])
    

    return (
        <div className="home">
            <div className="container" style={{display:'flex',flexFlow:'wrap',justifyContent:'center'}}>
                <div className="row align-items-center my-5">
                    <div className="col-lg">
                        <p> rtx 3080 : {getData("2080") } </p>
                        <p> if this indefinitely shows nothing, that means i cba.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RtxC