import { useState } from 'react';
import { API_BASE_URL } from '../lib/constants';

export function useAnalyst() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [response, setResponse] = useState('');

  async function ask(question: string, activeCountry?: string) {
    setIsStreaming(true);
    setResponse('');

    try {
      const res = await fetch(`${API_BASE_URL}/analyst/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          context: { activeCountry, currentThreatLevel: 92 },
          stream: true,
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));

        for (const line of lines) {
          const data = JSON.parse(line.slice(6));
          if (data.type === 'delta') {
            setResponse((prev) => prev + data.text);
          } else if (data.type === 'done') {
            setIsStreaming(false);
          }
        }
      }
    } catch (err) {
      console.error('Analyst error:', err);
      setIsStreaming(false);
    }
  }

  return { ask, response, isStreaming };
}
