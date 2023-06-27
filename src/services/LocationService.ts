import {ILocation} from "../domain/ILocation";
import {IWarehouse} from "../domain/IWarehouse";
import { IJWTResponse } from "../dto/IJWTResponse";
import { BaseEntityService } from "./BaseEntityService";

export class LocationService extends BaseEntityService<ILocation> {
    constructor(setJwtResponse: ((data: IJWTResponse | null) => void)){
        super('v1/locations', setJwtResponse);
    }
}