import { IBaseEntity } from "./IBaseEntity";

export interface ITrainingPlan extends IBaseEntity {
    planName: string,
    appUserId: string,    
}