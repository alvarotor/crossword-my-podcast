import { Router, Request, Response, NextFunction } from 'express';
import { validateTranscript } from '../middleware/validation';
import { AppError } from '../middleware/errorHandler';
import { generateCrossword } from '../controllers/crosswordController';

const router = Router();

router.post('/generate-crossword', validateTranscript, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { transcript } = req.body;
        const crossword = await generateCrossword(transcript, res);
        res.status(200).json({ crossword });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            console.error('Error generating crossword:', error);
            next(error);
        }
    }
});

export default router;
