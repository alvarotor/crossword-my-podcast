import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    openai: {
        apiKey: process.env.OPENAI_API_KEY
    },
    crossword: {
        maxWords: 15,
        gridSize: {
            min: 10,
            max: 15
        }
    },
    cors: {
        origin: process.env.CORS_ORIGIN || '*'
    },
    wordnet: {
        dataDir: process.env.WORDNET_DATA_DIR || './node_modules/wordnet-db/dict'
    },
    keyword: {
        minContextLength: 20,
        maxContextLength: 150,
        preferContextClues: true,
        wordLength: {
            min: 3,
            max: 15
        }
    }
};
