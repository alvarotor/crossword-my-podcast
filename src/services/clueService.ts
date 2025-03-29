export interface GeneratedClue {
    answer: string;
    clue: string;
}

export class ClueGenerator {
    private findSentenceWithWord(word: string, sentences: string[]): string | null {
        return sentences.find(sentence => 
            sentence.toLowerCase().includes(word.toLowerCase())
        ) || null;
    }

    private createClueFromSentence(sentence: string, word: string): string {
        return sentence.toLowerCase().replace(word.toLowerCase(), '_____');
    }

    generateClues(keywords: string[], sentences: string[]): GeneratedClue[] {
        return keywords.map(word => {
            const sentence = this.findSentenceWithWord(word, sentences);
            const clue = sentence 
                ? this.createClueFromSentence(sentence, word)
                : `Definition for ${word}`;  // Fallback clue

            return {
                answer: word,
                clue: clue
            };
        });
    }
}
