import { IncomingMessage, ServerResponse } from 'http';
import https from 'https';

export async function handleAiRequest(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const data = JSON.stringify({
    model: 'gpt-3.5-turbo',
    temperature: 1,
    messages: [
      {
        role: 'system',
        content: 'You are a helpful city guide.',
      },
      {
        role: 'user',
        content:
          "I want to have fun, I'm in Vilnius, come up with one very specific task and very specific place",
      },
      {
        role: 'user',
        content: 'In the end of the response point out the address and place',
      },
    ],
  });

  const options = {
    hostname: 'api.openai.com',
    port: 443,
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
  };

  const aiReq = https.request(options, (aiRes) => {
    let responseBody = '';

    aiRes.on('data', (chunk) => {
      responseBody += chunk;
    });

    aiRes.on('end', () => {
      res.end(responseBody);
    });
  });

  aiReq.on('error', (error) => {
    console.error(error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Failed to process AI request' }));
  });

  aiReq.write(data);
  aiReq.end();
}
