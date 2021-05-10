import { Request, Response } from 'express';

/**
 * @exports testRoute
 * @description An API route for testing if the server is up.
 * @param req 
 * @param res 
 */
export const testRoute = (req: Request, res: Response) : void =>
{
    res.status(200).json({
        success: true,
        status: res.statusCode,
        service: process.env.SERVICE_NAME,
        message: `Hello from service '${ process.env.SERVICE_NAME }'`,
    });
};
