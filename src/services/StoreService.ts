import {IStore} from "../domain/IStore";
import {IWarehouse} from "../domain/IWarehouse";
import { IJWTResponse } from "../dto/IJWTResponse";
import { BaseEntityService } from "./BaseEntityService";

export class StoreService extends BaseEntityService<IStore> {
    constructor(setJwtResponse: ((data: IJWTResponse | null) => void)){
        super('v1/stores', setJwtResponse);
    }
}