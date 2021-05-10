import 'dotenv/config';

import { Logger } from '@assetory/logger';
import { r } from 'rethinkdb-ts';

export class DBConfig
{
    host : string;
    port : number;
    logger : Logger;
    connection : any;

    constructor(logger : Logger, host : string = 'database', port : number = 28015)
    {
        this.host = host;
        this.port = port;
        this.logger = logger;
        this.connection = null;
    }

    connect = async () : Promise<any> =>
    {
        // const newConnection = await r.connect({ host: this.host, port: this.port });

        // return newConnection;

        return await r.connect({ host: this.host, port: this.port }).then(conn =>
        {
            this.connection = conn;

            this.logger.info(`succesfully connected to '${ this.host }' on port '${this.port}'`);
        }).catch((err : any) =>
        {
            this.logger.error(`failed to connect to '${ this.host }' on port '${ this.port }'`);
        });
    }

    closeConnection = async () : Promise<boolean> =>
    {
        const logger = this.logger;
        const host = this.host;
        const port = this.port;

        const currentConnection = this.connection.close({ noreplyWait: false });

        currentConnection.then(function()
        {
            logger.info(`succesfully disconnected from '${ host }' on port '${ port }'`);
            return true;
        }).error(function(err : any)
        {
            logger.error(`failed to disconnect from '${ host }' on port '${ port }'`);
        });

        return false;
    }
}