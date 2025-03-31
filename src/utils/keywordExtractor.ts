import { extractKeywords as extractKeywordsService } from '../services/keywordService';
import { config } from '../config';

export async function extractKeywords(transcript: string): Promise<string[]> {
    const maxKeywords = config.crossword.maxWords;
    const keywords = await extractKeywordsService(transcript, maxKeywords);
    return keywords.map(k => k.word);
}
