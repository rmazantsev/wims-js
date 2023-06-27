import { ITrainingPlan } from "../domain/ITrainingPlan";
import { IJWTResponse } from "../dto/IJWTResponse";
import { BaseEntityService } from "./BaseEntityService";

export class TrainingPlanService extends BaseEntityService<ITrainingPlan> {
    constructor(setJwtResponse: ((data: IJWTResponse | null) => void)){
        super('v1/TrainingPlans', setJwtResponse);
    }
}