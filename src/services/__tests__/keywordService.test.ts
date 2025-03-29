import { extractKeywords } from '../keywordService';

describe('extractKeywords', () => {
    it('should extract keywords based on TF-IDF', async () => {
        const text = 'This is a test transcript with important words like podcast and crossword.';
        const keywords = await extractKeywords(text, 5);
        expect(keywords).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ word: 'podcast' }),
                expect.objectContaining({ word: 'crossword' })
            ])
        );
    });

    it('should fallback to RAKE if TF-IDF is insufficient', async () => {
        const text = 'Short text with few keywords.';
        const keywords = await extractKeywords(text, 5);
        expect(keywords.length).toBeGreaterThan(0);
    });

    it('should fallback to NER if RAKE is insufficient', async () => {
        const text = 'John Doe works at Microsoft.';
        const keywords = await extractKeywords(text, 5);
        expect(keywords).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ word: 'John' }),
                expect.objectContaining({ word: 'Microsoft' })
            ])
        );
    });
});
