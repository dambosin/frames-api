import fs from 'fs';
import path from 'path';

type Rectangle = {
    width: number;
    height: number;
};

type FrameBaseModel = {
    frameId: string;
    price: number;
    frameSize: Rectangle;
    visualizationFrameSize: Rectangle;
}

export type FrameSaveModel = FrameBaseModel & {
    image: Buffer;
}

type FrameLoadModel = FrameBaseModel & {
    image: string;    
}

type FrameModel = FrameBaseModel & {
    id: string;
    imageSrc: string;    
}


interface IFrameService {
    getFrames(): FrameLoadModel[];
    saveFrame(frame: FrameSaveModel): void;
}

export class FrameService implements IFrameService {
    private readonly _fileName: string;
    private readonly _folder: string;

    constructor(framesFolder: string, fileDB: string) {
        this._folder = path.join(__dirname, framesFolder);
        this._fileName = fileDB;
    }

    getFrames(): FrameLoadModel[] {
        return this.loadFramesFromFile().map((frame) => ({
            frameId: frame.frameId,
            image: fs.readFileSync(path.join(this._folder, 'frames', frame.imageSrc)).toString('base64'),
            price: frame.price,
            frameSize: frame.frameSize,
            visualizationFrameSize: frame.visualizationFrameSize,
        }));
    }

    saveFrame(frame: FrameSaveModel): void {
        console.log('entered  saveFrame');
        console.log(frame);
        const frames = this.loadFramesFromFile();
        if (frames.some((f) => f.frameId === frame.frameId)) {
            throw new Error();
        }
        const currentDateAsJson = new Date().toJSON().slice(0, 10);
        let counter = 0;
        frames.forEach((frame) => {
            if (frame.imageSrc.includes(currentDateAsJson)) {
                counter++;
            }
        });
        const imageSrc = currentDateAsJson + '_' + counter + '.jpg';
        const imagePath = path.join(this._folder, 'frames', imageSrc);
        fs.writeFileSync(imagePath, frame.image, 'binary');
        const newFrameModels = [
            ...frames,
            {
                frameId: frame.frameId,
                price: frame.price,
                frameSize: frame.frameSize,
                visualizationFrameSize: frame.visualizationFrameSize,
                imageSrc,
                id: `${Math.random() * 1000000}`,
            }
        ];
        const framesPath = path.join(this._folder, this._fileName);
        fs.writeFileSync(framesPath, JSON.stringify(newFrameModels));
    }

    private loadFramesFromFile(): FrameModel[] {
        const dataPath = path.join(this._folder, this._fileName);
        const josnString = fs.readFileSync(dataPath, 'utf-8');
        try {
            const frames: FrameModel[] = JSON.parse(josnString);

            const result: {
                frame: FrameModel;
                errors: string[];
            }[] = [];
            frames.forEach((frame) => result.push({frame, errors: []}));

            const framesWithErorrs = result.filter((result) => result.errors.length > 0);
            framesWithErorrs.forEach((frame) => {
                console.error(frame.errors, frame.frame);
            });
            return framesWithErorrs.length === 0 ? frames : [];
        } catch (error) {
            throw new Error(`Error parsing JSON file: ${error}`);
        }
    }
}
