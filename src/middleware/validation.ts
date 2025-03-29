import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler'; // Ensure AppError is imported

export const validateTranscript = (req: Request, res: Response, next: NextFunction) => {
    const { transcript } = req.body;

    if (!transcript || typeof transcript !== 'string' || transcript.trim().length < 50) {
        throw new AppError(400, 'Valid transcript is required (min 50 characters)');
    }

    next();
};
