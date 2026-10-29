import { generateChatResponse, ChatMessage, extractSafeErrorMessage, getSmartFallbackReply } from '../../server/geminiService';

interface NetlifyEvent {
  httpMethod: string;
  body: string | null;
  headers: Record<string, string | undefined>;
}

export const handler = async (event: NetlifyEvent) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed. Use POST.' }),
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing request body.' }),
      };
    }

    const { messages } = JSON.parse(event.body) as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Messages array is required.' }),
      };
    }

    const reply = await generateChatResponse(messages);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply }),
    };
  } catch (error: any) {
    const safeMsg = extractSafeErrorMessage(error);
    console.info('[Netlify Chat Notice]:', safeMsg);
    let parsedMessages: ChatMessage[] = [];
    try {
      if (event.body) {
        parsedMessages = JSON.parse(event.body).messages || [];
      }
    } catch {
      // ignore
    }
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reply: getSmartFallbackReply(parsedMessages),
      }),
    };
  }
};
