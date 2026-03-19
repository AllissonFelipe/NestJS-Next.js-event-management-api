import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  try {
    const body = await req.json();
    const response = await fetch(`${process.env.API_URL}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('API Route Error:', error);
    const message = error instanceof Error ? error.message : 'Erro interno no servidor.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
