import {AxiosError} from "axios";
import {IBaseEntity} from "../domain/IBaseEntity";
import {IJWTResponse} from "../dto/IJWTResponse";
import {BaseService} from "./BaseService";
import {IdentityService} from "./IdentityService";

export abstract class BaseEntityService<TEntity extends IBaseEntity> extends BaseService {
    constructor(
        baseUrl: string,
        private setJwtResponse: ((data: IJWTResponse | null) => void)
    ) {
        super(baseUrl);
    }

    async getAll(jwtData: IJWTResponse): Promise<TEntity[] | undefined> {
        try {
            const response = await this.axios.get<TEntity[]>('',
                {
                    headers: {
                        'Authorization': 'Bearer ' + jwtData.jwt
                    }
                }
            );

            console.log('response', response);
            if (response.status === 200) {
                return response.data;
            }

            return undefined;
        } catch (e) {
            console.log('error: ', (e as Error).message, e);
            if ((e as AxiosError).response?.status === 401) {
                console.error("JWT expired, refreshing!");
                // try to refresh the jwt
                let identityService = new IdentityService();
                let refreshedJwt = await identityService.refreshToken(jwtData);
                if (refreshedJwt) {
                    this.setJwtResponse(refreshedJwt);

                    const response = await this.axios.get<TEntity[]>('',
                        {
                            headers: {
                                'Authorization': 'Bearer ' + refreshedJwt.jwt
                            }
                        }
                    );
                    if (response.status === 200) {
                        return response.data;
                    }
                } else {
                    this.setJwtResponse(null);
                    window.location.replace('/login');
                }
            }

        }
    }

    async getEntity(entityId: string, jwtData: IJWTResponse): Promise<TEntity | undefined> {
        try {
            const response = await this.axios.get<TEntity>(entityId,
                {
                    headers: {
                        'Authorization': 'Bearer ' + jwtData.jwt
                    }
                }
            );
            console.log('response', response);
            if (response.status === 200) {
                return response.data;
            }

            return undefined;
        } catch (e) {
            console.log('error: ', (e as Error).message, e);
            if ((e as AxiosError).response?.status === 401) {
                console.error("JWT expired, refreshing!");
                // try to refresh the jwt
                let identityService = new IdentityService();
                let refreshedJwt = await identityService.refreshToken(jwtData);
                if (refreshedJwt) {
                    this.setJwtResponse(refreshedJwt);

                    const response = await this.axios.get<TEntity>(entityId,
                        {
                            headers: {
                                'Authorization': 'Bearer ' + refreshedJwt.jwt
                            }
                        }
                    );
                    if (response.status === 200) {
                        return response.data;
                    }
                } else {
                    this.setJwtResponse(null);
                    window.location.replace('/login');
                }
            }
        }
    }

    async createEntity(entity: TEntity, jwtData: IJWTResponse): Promise<TEntity | undefined> {
        try {
            const response = await this.axios.post<TEntity>('',
                entity,
                {
                    headers: {
                        'Authorization': 'Bearer ' + jwtData.jwt
                    },
                }
            );
            console.log('response', response);
            if (response.status === 201) {
                return response.data;
            }

            return undefined;
        } catch (e) {
            console.log('error: ', (e as Error).message, e);
            if ((e as AxiosError).response?.status === 401) {
                console.error("JWT expired, refreshing!");
                // try to refresh the jwt
                let identityService = new IdentityService();
                let refreshedJwt = await identityService.refreshToken(jwtData);
                if (refreshedJwt) {

                    console.log("BaseEntityService<TEntity  createEntity  refreshedJwt:", refreshedJwt)

                    this.setJwtResponse(refreshedJwt);

                    const response = await this.axios.post<TEntity>('',
                        entity,
                        {
                            headers: {
                                'Authorization': 'Bearer ' + refreshedJwt.jwt
                            },
                        }
                    );
                    if (response.status === 201) {
                        return response.data;
                    }
                } else {
                    this.setJwtResponse(null);
                    window.location.replace('/login');
                }
            }
        }
    }

    async deleteEntity(entityId: string, jwtData: IJWTResponse): Promise<boolean | undefined | AxiosError> {
        try {
            const response = await this.axios.delete<TEntity>(entityId,
                {
                    headers: {
                        'Authorization': 'Bearer ' + jwtData.jwt
                    }
                }
            );
            console.log('response', response);
            if (response.status === 204) {
                return true;
            }

            return undefined;
        } catch (e) {
            console.log('error: ', (e as Error).message, e);
            if ((e as AxiosError).response?.status === 401) {
                console.error("JWT expired, refreshing!");
                // try to refresh the jwt
                let identityService = new IdentityService();
                let refreshedJwt = await identityService.refreshToken(jwtData);
                if (refreshedJwt) {
                    this.setJwtResponse(refreshedJwt);

                    const response = await this.axios.delete<TEntity>(entityId,
                        {
                            headers: {
                                'Authorization': 'Bearer ' + refreshedJwt.jwt
                            }
                        }
                    );
                    if (response.status === 204) {
                        return true;
                    }
                } else {
                    this.setJwtResponse(null);
                    window.location.replace('/login');
                }
            }
            return e as AxiosError;
        }
    }

    async updateEntity(entity: TEntity, jwtData: IJWTResponse): Promise<boolean | undefined> {
        try {
            const response = await this.axios.put<TEntity>(`${entity.id}`,
                entity,
                {
                    headers: {
                        'Authorization': 'Bearer ' + jwtData.jwt
                    },
                }
            );
            console.log('response', response);
            if (response.status === 204) {
                return true;
            }

            return undefined;
        } catch (e) {
            console.log('error: ', (e as Error).message, e);
            if ((e as AxiosError).response?.status === 401) {
                console.error("JWT expired, refreshing!");
                // try to refresh the jwt
                let identityService = new IdentityService();
                let refreshedJwt = await identityService.refreshToken(jwtData);

                console.log("BaseEntityService<TEntity  updateEntity  refreshedJwt:", refreshedJwt)

                if (refreshedJwt) {
                    this.setJwtResponse(refreshedJwt);

                    const response = await this.axios.put<TEntity>(`${entity.id}`,
                        {
                            headers: {
                                'Authorization': 'Bearer ' + refreshedJwt.jwt
                            },
                            data: {...entity}
                        }
                    );
                    if (response.status === 204) {
                        return true;
                    }
                } else {
                    this.setJwtResponse(null);
                    window.location.replace('/login');
                }
            }
        }
    }
}