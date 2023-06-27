import {IInventoryTransaction} from "../domain/IInventoryTransaction";
import {IWarehouse} from "../domain/IWarehouse";
import { IJWTResponse } from "../dto/IJWTResponse";
import { BaseEntityService } from "./BaseEntityService";

export class InventoryTransactionService extends BaseEntityService<IInventoryTransaction> {
    constructor(setJwtResponse: ((data: IJWTResponse | null) => void)){
        super('v1/inventorytransactions', setJwtResponse);
    }
}