import { Logger } from '@assetory/logger';
import express from 'express';
import path from 'path';

/**
 * @class ApiConfig
 * @description Contains the general configurations for the API
 */
export class ApiConfig
{
    // eslint-disable-next-line lines-around-comment
    /**
     * @constructor
     * @param { express.Application } app
     */
    constructor(app : express.Application, logger : Logger)
    {
        app.use((req, res, next) =>
        {
            logger.info(`${req.method}: ${ req.url } called by ${ req.ip }`);
            next();
        });
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(`/dashboard/${ process.env.SERVICE_NAME }/static`, express.static(path.join(__dirname, '../../../build/client/'), { index: false }));
    }
}
