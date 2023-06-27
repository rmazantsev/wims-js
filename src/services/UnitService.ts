import {IUnit} from "../domain/IUnit";
import {IWarehouse} from "../domain/IWarehouse";
import { IJWTResponse } from "../dto/IJWTResponse";
import { BaseEntityService } from "./BaseEntityService";

export class UnitService extends BaseEntityService<IUnit> {
    constructor(setJwtResponse: ((data: IJWTResponse | null) => void)){
        super('v1/units', setJwtResponse);
    }
}