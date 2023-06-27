import {IWarehouse} from "../domain/IWarehouse";
import { IJWTResponse } from "../dto/IJWTResponse";
import { BaseEntityService } from "./BaseEntityService";

export class WarehouseService extends BaseEntityService<IWarehouse> {
    constructor(setJwtResponse: ((data: IJWTResponse | null) => void)){
        super('v1/warehouses', setJwtResponse);
    }
}