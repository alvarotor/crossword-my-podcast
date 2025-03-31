import axios from 'axios';
import { config } from '../config';

export class ClueGenerator {

  async generateClue(word: string, context: string): Promise<string> {
    try {
      return await this.generateClueWithAI(word, context);
    } catch (error) {
      console.error(`Error generating AI clue for ${word}:`, error);
      return await this.getDictionaryDefinition(word) || `Related to podcast content (${word.length} letters)`;
    }
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
      throw error;
    }
  }

  private async getDictionaryDefinition(word: string): Promise<string | null> {
    try {
      interface DictionaryResponse {
        word: string;
        meanings: {
          partOfSpeech: string;
          definitions: { definition: string }[];
        }[];
      }

      const response = await axios.get<DictionaryResponse[]>(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        const firstMeaning = response.data[0].meanings[0];
        if (firstMeaning && firstMeaning.definitions.length > 0) {
          return firstMeaning.definitions[0].definition;
        }
      }
    } catch (error) {
      console.error('Error fetching dictionary definition:', error);
    }
    return null;
  }
}
