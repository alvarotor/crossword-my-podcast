import { Response } from 'express';
import { generateLayout } from 'crossword-layout-generator';
import { extractKeywords } from '../utils/keywordExtractor';
import { generateClues } from '../utils/clueGenerator';
import { CrosswordLayout } from 'crossword-layout-generator';

export async function generateCrossword(transcript: string): Promise<CrosswordLayout> {
    const keywords = await extractKeywords(transcript);

    if (keywords.length === 0) {
        throw new Error('No keywords could be extracted from the transcript.');
    }

    const wordsWithClues = await generateClues(keywords, transcript);
    const layout = generateLayout(wordsWithClues);

    // Return the layout directly since it already has the correct structure
    return {
        table: layout.table,
        result: layout.result,
        rows: layout.rows,
        cols: layout.cols,
        table_string: layout.table_string
    };
}

export const generateCrosswordHandler = async (req: string, res: Response) => {
  try {
    const transcript: string = req;

    if (!transcript || typeof transcript !== 'string' || transcript.trim().length < 50) {
      return res.status(400).json({ error: 'Transcript must be a valid string with at least 50 characters.' });
    }

    const crossword = await generateCrossword(transcript);

    res.status(200).json({ crossword });
  } catch (error) {
    console.error('Error generating crossword:', error);

    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred while generating the crossword.' });
    }
  }
};
