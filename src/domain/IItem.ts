import { IBaseEntity } from "./IBaseEntity";
import {ICategory} from "./ICategory";
import {IItemComponent} from "./IItemComponent";
import {IUnit} from "./IUnit";

export interface IItem extends IBaseEntity {
    name: string, 
    description?: string,   
    itemComponents?: IItemComponent[],
    unit: IUnit,
    category?: ICategory,
}