import { IBaseEntity } from "./IBaseEntity";
import {IUnit} from "./IUnit";

export interface IItemComponent extends IBaseEntity {
    componentQuantity: string,    
    componentItem?: {
        unit?: IUnit,
        id: string,
        name: string,
    }
    itemId: string,
    componentItemId?: string,
}