import express from 'express';
import controller from '../controllers/test.controller';

const router = express.Router();
router.post('/saveFrame', controller.saveFrameHandler);

router.get('/getFrames', controller.getFramesHandler);

export default router;