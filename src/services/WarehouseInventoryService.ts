import {IStorageInventory} from "../domain/IStorageInventory";
import { IJWTResponse } from "../dto/IJWTResponse";
import { BaseEntityService } from "./BaseEntityService";

export class WarehouseInventoryService extends BaseEntityService<IStorageInventory> {
    constructor(setJwtResponse: ((data: IJWTResponse | null) => void)){
        super('v1/warehouseinventories', setJwtResponse);
    }
}