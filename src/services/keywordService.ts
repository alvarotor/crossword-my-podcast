import natural from 'natural';
import { rake } from 'rapid-automated-keyword-extraction';
import { config } from '../config';
import nlp from 'compromise';

interface Keyword {
  word: string;
  score: number;
}

export async function extractKeywords(text: string, maxKeywords: number = config.crossword.maxWords): Promise<Keyword[]> {
  // Tokenize text
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text) || [];

  // Filter tokens
  const filteredTokens = tokens
    .filter(token => token.length >= config.keyword.wordLength.min && token.length <= config.keyword.wordLength.max) // Enforce word length constraints
    .filter(token => !natural.stopwords.includes(token)) // Remove stopwords
    .map(token => token.toLowerCase());

  // Calculate word frequencies
  const tfidf = new natural.TfIdf();
  tfidf.addDocument(filteredTokens);

  const wordScores: Keyword[] = [];
  filteredTokens.forEach(token => {
    if (token.match(/^[a-z]+$/i)) { // Only alphabetic words
      const score = tfidf.tfidf(token, 0);
      if (!wordScores.some(keyword => keyword.word === token)) {
        wordScores.push({ word: token, score });
      }
    }
  });

  // Use RAKE as a fallback if TF-IDF results are insufficient
  if (wordScores.length < maxKeywords) {
    const rakeKeywords = await rake(text, { minLength: 3, maxLength: 15 });
    rakeKeywords.forEach(keyword => {
      if (!wordScores.some(k => k.word === keyword)) {
        wordScores.push({ word: keyword, score: 1 }); // Assign a default score
      }
    });
  }

  // Use NER (compromise) as a final fallback
  if (wordScores.length < maxKeywords) {
    const doc = nlp(text);
    const namedEntities = doc.nouns().out('array');
    namedEntities.forEach((entity: string) => {
      if (!wordScores.some(k => k.word === entity)) {
        wordScores.push({ word: entity, score: 0.5 }); // Assign a lower default score
      }
    });
  }

  // Handle multi-word answers by replacing spaces with underscores
  wordScores.forEach(keyword => {
    keyword.word = keyword.word.replace(/\s+/g, '_');
  });

  // Manual pruning: Remove duplicates and prioritize single-word keywords
  const uniqueKeywords = Array.from(new Set(wordScores.map(k => k.word)));
  const prunedKeywords = uniqueKeywords
    .filter(word => word.split('_').length === 1) // Prioritize single-word keywords
    .slice(0, maxKeywords);

  return prunedKeywords.map(word => ({
    word,
    score: wordScores.find(k => k.word === word)?.score || 0
  }));
}
