import { Response } from 'express';
import { preprocessTranscript } from '../services/transcriptService';
import { extractKeywords } from '../services/keywordService';
import { generateCrosswordLayout } from '../services/crosswordService';
import { ClueGenerator } from '../services/clueGenerator';

export const generateCrossword = async (req: string, res: Response) => {
  try {
    const transcript: string = req;

    if (!transcript || typeof transcript !== 'string' || transcript.trim().length < 50) {
      return res.status(400).json({ error: 'Transcript must be a valid string with at least 50 characters.' });
    }

    const cleanedTranscript = preprocessTranscript(transcript);
    const keywords = await extractKeywords(cleanedTranscript);

    if (keywords.length === 0) {
      return res.status(400).json({ error: 'No keywords could be extracted from the transcript.' });
    }

    const clueGenerator = new ClueGenerator();
    const wordsWithClues = await Promise.all(
      keywords.map(async (keyword) => ({
        answer: keyword.word,
        clue: await clueGenerator.generateClue(keyword.word, cleanedTranscript)
      }))
    );

    const crosswordLayout = generateCrosswordLayout(wordsWithClues);

    res.status(200).json({
      crossword: crosswordLayout
    });
  } catch (error) {
    console.error('Error generating crossword:', error);

    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred while generating the crossword.' });
    }
  }
};
