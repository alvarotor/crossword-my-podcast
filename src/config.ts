import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',
  wordnet: {
    dataDir: process.env.WORDNET_DATA_DIR || './data/wordnet',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
  api: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'text-davinci-003',
    },
  },
  crossword: {
    maxWords: parseInt(process.env.CROSSWORD_MAX_WORDS || '10', 10),
    gridSize: {
      max: 15,
      min: 5
  }
  },
  keyword: {
    wordLength: {
      min: parseInt(process.env.KEYWORD_MIN_LENGTH || '3', 10),
      max: parseInt(process.env.KEYWORD_MAX_LENGTH || '15', 10),
    },
  },
};