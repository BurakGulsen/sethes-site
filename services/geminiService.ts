import { ChatMessage } from '../types';

export const sendMessageToGemini = async (message: string, history: ChatMessage[] = []): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.text || 'Design requires silence to be heard. (No text returned)';
  } catch (error) {
    console.error('Gemini Error:', error);
    return 'I am currently meditating on new forms. Please try again later.';
  }
};
