interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface Env {
  GEMINI_API_KEY: string;
}

const SYSTEM_INSTRUCTION = `
You are the "Atelier Concierge" for a ultra-luxury furniture brand named ARBEM.
Your tone is sophisticated, minimalist, artistic, and slightly mysterious.
You value natural materials (brass, stone, rare woods), brutalist geometry, and "emotional lighting".
Do not act like a generic assistant. Act like a high-end interior designer.
If the user speaks Turkish, reply in elegant Turkish. If English, reply in English.
Keep responses concise (under 100 words) but poetic.
Advise on furniture arrangements, material pairings, and lighting atmosphere.
`;

const jsonResponse = (text: string, status = 200) =>
  new Response(JSON.stringify({ text }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  if (!env.GEMINI_API_KEY) {
    return jsonResponse('Atelier Asistanı şu anda yapılandırma eksikliği nedeniyle hizmet veremiyor. (API Key Missing)');
  }

  let body: { message?: string; history?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return jsonResponse('Invalid request.', 400);
  }

  const { message, history } = body;
  if (!message || typeof message !== 'string') {
    return jsonResponse('Invalid request.', 400);
  }

  const contents = [
    ...(Array.isArray(history) ? history : []).map((m) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          generationConfig: { temperature: 0.7 },
        }),
      }
    );

    if (!response.ok) {
      console.error('Gemini API error', response.status, await response.text());
      return jsonResponse('I am currently meditating on new forms. Please try again later.');
    }

    const data: any = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return jsonResponse(text || 'Design requires silence to be heard. (No text returned)');
  } catch (error) {
    console.error('Gemini Error:', error);
    return jsonResponse('I am currently meditating on new forms. Please try again later.');
  }
};
