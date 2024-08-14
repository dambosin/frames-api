import http from 'http';
import express, {Express} from 'express';
import morgan from 'morgan';
import routes from './routes/index';
import cors from 'cors';

const router: Express = express();
router.use(morgan('dev'));

router.use(cors())
router.use(express.urlencoded({extended: false, limit: '50mb'}));

router.use(express.json({limit: '50mb'}));

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
        return res.status(200).json({});
    }
    next();
});

router.use('/', routes);

router.use((req, res, next) => {
    const error = new Error('Not found');
    return res.status(404).json({
        message: error.message
    });
});

const httpServer = http.createServer(router);
const PORT: any = 3514;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
