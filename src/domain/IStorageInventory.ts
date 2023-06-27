import { IBaseEntity } from "./IBaseEntity";
import {IItem} from "./IItem";
import {ILocation} from "./ILocation";
import {IStore} from "./IStore";
import {IWarehouse} from "./IWarehouse";

export interface IStorageInventory extends IBaseEntity {
    quantity: number,    
    lastUpdated?: string,
    item?: IItem,
    locationId?: string,
    location?: ILocation,
    warehouse?: IWarehouse,
    store?: IStore,
    itemId?: string,
    storeId?: string,
    warehouseId?: string,
}