export class GridOptimizer {
    optimizeGridSize(words: string[]): { width: number; height: number } {
        const longestWord = Math.max(...words.map(w => w.length));
        const totalChars = words.reduce((sum, w) => sum + w.length, 0);
        
        // Calculate optimal dimensions based on word lengths
        return {
            width: Math.max(longestWord, Math.ceil(Math.sqrt(totalChars))),
            height: Math.max(longestWord, Math.ceil(Math.sqrt(totalChars)))
        };
    }
}