export function preprocessTranscript(transcript: string): string {
  return transcript
    // Convert to lowercase
    .toLowerCase()
    // Remove timestamps, speaker labels, parenthetical notes
    .replace(/\[\w+\]:/g, '')
    .replace(/\(\d+:\d+\)/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\[\d+:\d+\]/g, '')
    // Remove filler words like "um", "uh"
    .replace(/\b(um|uh|like|you know|so)\b/g, '')
    // Clean up extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}
