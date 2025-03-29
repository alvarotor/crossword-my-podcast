import { Request, Response } from 'express';
import { preprocessTranscript } from '../services/transcriptService';
import { extractKeywords } from '../services/keywordService';
import { generateCrosswordLayout } from '../services/crosswordService';
import { ClueGenerator } from '../services/clueGenerator';

export const generateCrossword = async (req: Request, res: Response) => {
  try {
    const { transcript } = req.body;

    const cleanedTranscript = preprocessTranscript(transcript);
    const keywords = await extractKeywords(cleanedTranscript);
    
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
    res.status(500).json({ error: 'An error occurred while generating the crossword.' });
  }
};
