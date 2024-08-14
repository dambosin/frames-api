import axios, { AxiosResponse } from "axios";
import { NextFunction, Request, Response } from "express";
import { FrameSaveModel, FrameService } from "../services/frame-service/FrameService";

export const saveFrameHandler = async (req: Request, res: Response, next: NextFunction) => {
    console.log('body', req.body);
    const model: FrameSaveModel = {
        frameId: req.body.frameId,
        price: req.body.price,
        frameSize: {
            width: req.body.frameSize.width,
            height: req.body.frameSize.height
        },
        visualizationFrameSize: {
            width: req.body.visualizationFrameSize.width,
            height: req.body.visualizationFrameSize.height
        },
        image: Buffer.from(req.body.image, 'base64'),
    };
    new FrameService('data', 'framesDB.json').saveFrame(model);
    console.log('saved');
    let result = req.body
    return res.send('body is ' + result);
}

export const  getFramesHandler = async (req: Request, res: Response, next: NextFunction) => {
    const result = new FrameService('data', 'framesDB.json').getFrames();

    return res.send(JSON.stringify(result));
};
 

export default { saveFrameHandler, getFramesHandler };