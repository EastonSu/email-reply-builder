import type { APIRoute } from 'astro';

const RESEND_API_URL = 'https://api.resend.com/emails';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { apiKey, payload } = body;

    if (!apiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing API key'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!payload) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing payload'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({
        success: false,
        error: data.message || `HTTP ${response.status}: ${response.statusText}`
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      emailId: data.id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};