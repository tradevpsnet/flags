export default {
  async fetch(request, env) {
    const { method } = request;
    const url = new URL(request.url);
    const filename = url.pathname.replace(/^\/+/, '');

    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    if (method !== 'GET') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    if (!filename.endsWith('.svg')) {
      return new Response('Not Found', { status: 404 });
    }
    
    try {

      const object = await env.COUNTRIES_BUCKET.get(filename);
      if (!object) {
        return new Response('Not Found', { status: 404 });
      }
      return new Response(object.body, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (err) {
      console.error('Error fetching object:', err);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};
