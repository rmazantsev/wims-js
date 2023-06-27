import {IItemComponent} from "../domain/IItemComponent";
import {IWarehouse} from "../domain/IWarehouse";
import { IJWTResponse } from "../dto/IJWTResponse";
import { BaseEntityService } from "./BaseEntityService";

export class ItemComponentService extends BaseEntityService<IItemComponent> {
    constructor(setJwtResponse: ((data: IJWTResponse | null) => void)){
        super('v1/itemcomponents', setJwtResponse);
    }
}