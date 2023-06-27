import { IBaseEntity } from "./IBaseEntity";

export interface ICategory extends IBaseEntity {
    name: string, 
    description?: string,   
}