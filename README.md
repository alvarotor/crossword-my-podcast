# crossword-my-podcast

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the required configuration (see `.env` example).

3. Build the project:
   ```bash
   npm run build
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Testing

1. Run the test suite:
   ```bash
   npm test
   ```

2. Check the coverage report in the `coverage/` directory.

## Deployment

1. Ensure the `.env` file is properly configured for the production environment.
2. Build the project:
   ```bash
   npm run build
   ```
3. Deploy the contents of the `dist/` directory to your production server.
4. Start the server using a process manager like `pm2`:
   ```bash
   pm2 start dist/index.js --name crossword-my-podcast
   ```

## Troubleshooting

1. **Server fails to start:**
   - Check the `.env` file for missing or incorrect configuration.
   - Ensure all dependencies are installed by running `npm install`.

2. **Crossword generation fails:**
   - Verify the transcript meets the minimum length requirement (50 characters).
   - Check the server logs for detailed error messages.

3. **OpenAI-related errors:**
   - Ensure the `OPENAI_API_KEY` is correctly set in the `.env` file.
   - Verify that the OpenAI API key has sufficient quota.

4. **Grid layout issues:**
   - Ensure the keywords extracted from the transcript are valid and not too long.
   - Check the `config.crossword.gridSize` settings in `src/config.ts`.

5. **Frontend issues:**
   - Ensure the `public/` directory is correctly copied to the `dist/` directory during the build process.
   - Check the browser console for JavaScript errors.

6. **Testing issues:**
   - Ensure `jest` is installed and properly configured.
   - Run `npm test` to verify the test suite.

For additional support, check the project repository or contact the maintainer.