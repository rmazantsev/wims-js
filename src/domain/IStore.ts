import { IBaseEntity } from "./IBaseEntity";

export interface IStore extends IBaseEntity {
    name: string,    
    address: string,
}