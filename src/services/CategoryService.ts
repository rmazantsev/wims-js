import {ICategory} from "../domain/ICategory";
import { IJWTResponse } from "../dto/IJWTResponse";
import { BaseEntityService } from "./BaseEntityService";

export class CategoryService extends BaseEntityService<ICategory> {
    constructor(setJwtResponse: ((data: IJWTResponse | null) => void)){
        super('v1/categories', setJwtResponse);
    }
}