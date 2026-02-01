import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';

// Helper to get a random API key from the list
function getRandomKey() {
  const keysEnv = process.env.GOOGLE_GENERATIVE_AI_API_KEYS || process.env.GOOGLE_API_KEYS;
  if (!keysEnv) {
    // Fallback to single key if list is not defined
    return process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
  }
  const keys = keysEnv.split(',').map(k => k.trim()).filter(Boolean);
  if (keys.length === 0) return '';
  return keys[Math.floor(Math.random() * keys.length)];
}

// Helper to create a provider instance with a specific key
function getGoogleProvider(apiKey: string) {
  return createGoogleGenerativeAI({
    apiKey: apiKey,
  });
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Normalize messages to CoreMessage format
    const coreMessages = messages.map((m: any) => {
      let content = m.content;
      if (!content && m.parts) {
        // Fallback for Vercel AI SDK v6 UIMessage having parts instead of content
        content = m.parts
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('');
      }
      return {
        role: m.role,
        content: content || '', // Ensure strictly string for simple text chat
      };
    });

    const systemPrompt = 'You are a helpful, expert AI assistant. Format answers with clear Markdown.';

    // Try with primary model (gemini-2.5-flash)
    try {
      const apiKey = getRandomKey();
      if (!apiKey) {
        console.error('SERVER ERROR: No API key found. GOOGLE_GENERATIVE_AI_API_KEYS:', process.env.GOOGLE_GENERATIVE_AI_API_KEYS ? 'Defined' : 'Undefined');
        throw new Error('No API key found (Environment variable missing or empty)');
      }

      const google = getGoogleProvider(apiKey);

      const result = streamText({
        model: google('gemini-2.5-flash'),
        messages: coreMessages,
        system: systemPrompt,
      });

      return result.toUIMessageStreamResponse();

    } catch (primaryError) {
      console.warn('Primary model failed, attempting fallback to gemini-1.5-flash. Error:', primaryError);

      // Retry with fallback model (gemini-1.5-flash) and potentially a different key
      const apiKey = getRandomKey();
      if (!apiKey) throw new Error('No API key found for fallback');

      const google = getGoogleProvider(apiKey);

      const result = streamText({
        model: google('gemini-1.5-flash'),
        messages: coreMessages,
        system: systemPrompt,
      });

      return result.toUIMessageStreamResponse();
    }

  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

