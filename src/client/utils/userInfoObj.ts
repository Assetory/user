import Keycloak from 'keycloak-js';
import axios from 'axios';

export default class UserInfoObj
{
    keycloak : Keycloak.KeycloakInstance;
    keycloakUser : any;
    dataBaseUser : any;

    constructor(keycloak : Keycloak.KeycloakInstance)
    {
        this.keycloak = keycloak;
        this.keycloakUser = undefined;
        this.dataBaseUser = undefined;
    }

    getFromKeycloak = () =>
    {
        return new Promise((resolve, reject) =>
        {
            this.keycloak.loadUserInfo().then(data =>
            {
                this.keycloakUser = data;

                resolve(data);
            })
            .catch(err => reject(err));
        });
    }

    getFromDatabase = () =>
    {
        return new Promise((resolve, reject) =>
        {
            
        });
    }
}
