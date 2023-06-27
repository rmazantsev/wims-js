import { IBaseEntity } from "./IBaseEntity";

export interface IWarehouse extends IBaseEntity {
    address: string,
    name: string,    
}