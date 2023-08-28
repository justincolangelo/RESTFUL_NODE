export interface Item {
    name : string,
    price : number,
    createdDate : number
}

export interface UnitItem extends Item {
    id : string
}

export interface Items {
    [key : string] : UnitItem
}