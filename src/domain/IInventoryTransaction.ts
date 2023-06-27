import { IBaseEntity } from "./IBaseEntity";
import {IItem} from "./IItem";
import {IStore} from "./IStore";
import {IWarehouse} from "./IWarehouse";

export interface IInventoryTransaction extends IBaseEntity {
    item: IItem,
    quantity: number, 
    transactionType: string
    timeStamp: string,
    isCustomerPickup: boolean,
    description?: string,
    fromLocation?: string   
    toLocation?: string   
    fromStore?: string   
    toStore?: string   
    fromWarehouse?: string   
    toWarehouse?: string
    appUser: {
        firstName: string,
        lastName: string,
    }  
    warehouse?: IWarehouse,
    store?: IStore,
}

// return new DateTime(1970, 1, 1) + new TimeSpan(msSinceEpoch * 10000);