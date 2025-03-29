import { WordNet } from 'natural';
import axios from 'axios';
import { config } from '../config';

export class ClueGenerator {
  private wordnet: WordNet;

  constructor() {
    this.wordnet = new WordNet(config.wordnet.dataDir);
  }

  async generateClue(word: string, context: string): Promise<string> {
    try {
      if (config.keyword.preferContextClues) {
        const contextClue = this.generateContextClue(word, context);
        if (contextClue) {
          return contextClue;
        }
      }

      const wordnetClue = await this.getWordNetClue(word);
      if (wordnetClue) {
        return wordnetClue;
      }

      return await this.generateClueWithAI(word, context);
    } catch (error) {
      console.error(`Error generating clue for ${word}:`, error);
      return await this.getDictionaryDefinition(word) || `Related to podcast content (${word.length} letters)`;
    }
  }

  private generateContextClue(word: string, context: string): string | null {
    const sentences = context.split(/[.!?]/).map(s => s.trim());
    const sentence = sentences.find(s => s.toLowerCase().includes(word.toLowerCase()));
    if (sentence) {
      return sentence.replace(new RegExp(`\\b${word}\\b`, 'gi'), '_____');
    }
    return "";
  }

  private getWordNetClue(word: string): Promise<string | null> {
    return new Promise((resolve) => {
      this.wordnet.lookup(word, (results) => {
        if (results && results.length > 0) {
          const definitions = results.map(result => result.def).filter(Boolean);
          if (definitions.length > 0) {
            resolve(definitions[0]);
            return;
          }
        }
        resolve(null);
      });
    });
  }

  private async generateClueWithAI(word: string, context: string): Promise<string> {
    if (!config.api.openai.apiKey) {
      return "";
    }

    try {
      interface OpenAIResponse {
        choices: { message: { content: string } }[];
      }

      const response = await axios.post<OpenAIResponse>('https://api.openai.com/v1/chat/completions', {
        model: config.api.openai.model,
        messages: [
          {
            role: "system",
            content: "You are a crossword clue creator. Generate a concise, clever, single crossword clue for a word."
          },
          {
            role: "user",
            content: `Create a crossword clue for the word "${word}". Context: ${context.substring(0, 300)}...`
          }
        ],
        max_tokens: 50
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.api.openai.apiKey}`
        }
      });

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return "";
    }
  }

  private async getDictionaryDefinition(word: string): Promise<string | null> {
    try {
      const response = await axios.get<{ meanings: { definitions: { definition: string }[] }[] }[]>(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        const definitions = response.data[0].meanings.flatMap((meaning: any) => meaning.definitions.map((def: any) => def.definition));
        return definitions.length > 0 ? definitions[0] : null;
      }
    } catch (error) {
      console.error('Error fetching dictionary definition:', error);
    }
    return null;
  }
}
