export function preprocessTranscript(transcript: string): string {
  return transcript
    // Convert to lowercase
    .toLowerCase()
    // Remove timestamps, speaker labels, parenthetical notes
    .replace(/\[\w+\]:/g, '')
    .replace(/\(\d+:\d+\)/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\[\d+:\d+\]/g, '')
    // Clean up extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}
