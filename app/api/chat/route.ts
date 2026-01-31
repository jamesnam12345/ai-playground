import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';

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

    const result = streamText({
      model: google('gemini-2.5-flash'),
      messages: coreMessages,
      system: 'You are a helpful, expert AI assistant. Format answers with clear Markdown.',
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
