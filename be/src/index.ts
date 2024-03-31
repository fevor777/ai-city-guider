import { createServer } from 'http';
import { parse } from 'url';
import { handleAiRequest } from './routes/aiRequest';

const server = createServer(async (req, res) => {
  const parsedUrl = parse(req.url!, true);

  if (req.method === 'GET') {
    if (parsedUrl.pathname === '/ai-request') {
      await handleAiRequest(req, res);
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  } else {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
