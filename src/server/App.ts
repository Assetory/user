import 'dotenv/config';

import http, { Server } from 'http';
import { createHttpTerminator, HttpTerminator } from 'http-terminator';
import express, { Application } from 'express';
import { Logger } from '@assetory/logger';
import path from 'path';
import { r } from 'rethinkdb-ts';

import { ApiConfig, DBConfig } from './config';
import { testRoute } from './api';
import { RethinkDBError } from 'rethinkdb-ts/lib/error/error';

/**
 * @class App
 * @description The main application class
 * @example
 * import App from './App';
 * const app = new App();
 */
class App
{
    app: Application;
    server: Server;
    terminator: HttpTerminator;
    serviceName : string;
    servicePort : number;
    database : DBConfig | undefined;
    logger : Logger;

    /**
     * @constructor
     */
    constructor()
    {
        this.app = express();
        this.server = new http.Server(this.app);
        this.terminator = createHttpTerminator({ server: this.server });
        this.serviceName = String(process.env.SERVICE_NAME);
        this.servicePort = Number(process.env.SERVICE_PORT);
        this.database = undefined;
        this.logger = new Logger({
            serviceName: process.env.SERVICE_NAME,
            throwErrors: true,
            connectOptions:
            {
                port: 6379,
                host: 'redis_logger',
                servername: 'redis_logger',
            },
        });
    }

    /**
     * @async
     * @method init
     * @description Handles the automatic start of configuration methods to set up the application.
     * @example
     * app.init();
     * @callback { Promise<boolean> }
     * @returns { boolean }
     */
    async init() : Promise<boolean>
    {
        await this.dbConfig();
        await this.apiConfig();
        
        this.database = await this.dbConfig();

        await this.database.connect();

        await this.routes();
        await this.start();

        return await true;
    }
    
    dbConfig() : DBConfig
    {
        const dbConfig = new DBConfig(this.logger);

        return dbConfig;
    }

    /**
     * @method config
     * @returns { ApiConfig() }
     */
    apiConfig() : ApiConfig
    {
        const apiConfig = new ApiConfig(this.app, this.logger);

        return apiConfig;
    }

    /**
     * @method apiRoutes
     * @description Handles the setup of Api routes.
     */
    routes() : void
    {
        const database = this.database;
        const logger = this.logger;

        this.app.get(`/${ this.serviceName }/api/test`, testRoute);

        this.app.post(`/${ process.env.SERVICE_NAME }/api/create`, function(req, res)
        {
            r.db('User').table('users').insert(req.query).run(database?.connection).then((data : any) =>
            {
                if(data.inserted === 1)
                {
                    logger.info(`successfully added user '${ req.query.id }'.`);
                    res.json({ success: true, new: true });
                }
                else
                {
                    res.json({ success: true, new: false });
                }
            }).catch((err : RethinkDBError) =>
            {
                logger.error(`failed to add user '${ req.query.id }' to database.`);

                res.json({
                    success: false,
                });
            });
        });

        this.app.get(`/dashboard/${ this.serviceName }/*`, (req, res) =>
        {
            res.sendFile(path.join(__dirname, '../../build/client', 'index.html'));
        });
    }

    /**
     * @method start
     * @description Starts the server on the given service-name and port.
     */
    start() : void
    {
        this.server.listen(this.servicePort, () =>
        {
            this.logger.info(`Service started => http://${ process.env.SERVICE_ENV === 'local' ? 'localhost' : 'develop.assetory.net'}/${this.serviceName}/api/test`);
        });
    }

    /**
     * @async
     * @method stop
     * @description Stop the currently running server and logger
     * @callback { Promise<boolean> }
     * @returns { boolean }
     */
    async stop() : Promise<boolean>
    {
        await this.logger.client.quit();
        await this.terminator.terminate();
        await this.database?.closeConnection();
        
        return await true;
    }
}

export default App;
