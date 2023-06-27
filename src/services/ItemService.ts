import {IItem} from "../domain/IItem";
import { IJWTResponse } from "../dto/IJWTResponse";
import { BaseEntityService } from "./BaseEntityService";

export class ItemService extends BaseEntityService<IItem> {
    constructor(setJwtResponse: ((data: IJWTResponse | null) => void)){
        super('v1/items', setJwtResponse);
    }
}