import React, { useState, useEffect } from 'react';

import axios from 'axios';
import Keycloak from 'keycloak-js';

import { LoadingSpinner } from './../Components/';

import UserInfoObj from './../utils/userInfoObj';

interface IProps {
    history: any;
}

const Settings : React.FunctionComponent<IProps> = ({ history }) : React.ReactElement =>
    {
        const [ keycloak, setKeycloak ] = useState<Keycloak.KeycloakInstance>(null);
        const [ authenticated, setAuthenticated ] = useState<boolean>(false);
        const [ loading, setLoading ] = useState<boolean>(true);
        const [ userInfo, setUserInfo ] = useState({});

        useEffect(() =>
        {
            const keycloakInfo = Keycloak({
                'realm': process.env.SERVICE_ENV,
                'url': 'https://auth.assetory.net/auth/',
                'clientId': 'service',
            });

            keycloakInfo.init({ onLoad: 'login-required' }).then(authenticated =>
            {
                const newUserObj = new UserInfoObj(keycloakInfo);
                newUserObj.getFromKeycloak().then(data => console.log(data));

                console.log(newUserObj);

                setKeycloak(keycloakInfo);
                setAuthenticated(authenticated);

                keycloakInfo.loadUserInfo().then(userInfo =>
                {
                    axios.post(
                        `/${ process.env.SERVICE_NAME}/api/user/create`,
                        null,
                        {
                            params: { id: userInfo[ 'sub' ], email: userInfo[ 'email' ] },
                        })
                    .then(response =>
                    {
                        console.log(response);
                    })
                    .catch(error =>
                    {
                        console.log(error);
                    });
    
                    setUserInfo({
                        id: userInfo[ 'sub' ],
                        email: userInfo[ 'email' ],
                        verified: userInfo[ 'email_verified' ] === true ? 'true': 'false',
                        userName: userInfo[ 'preferred_username' ] || 'Not set',
                        groups: userInfo[ 'groups' ],
                    });

                    setLoading(false);
                });
            });
        }, []);

        const logout = () : void =>
        {
            history.push('/');

            keycloak.logout();
        };

        return (
            <>
                {
                    !loading ?
                    <>
                        Home (SETTINGS) Component

                        <br />
                        <br />

                        <button onClick={() => logout()}>
                            Logout
                        </button>
                    </>
                    :
                    <LoadingSpinner />
                }
            </>
        );
    };

export default Settings;
