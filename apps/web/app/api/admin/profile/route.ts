import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken?.value}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || 'Erro ao buscar ADMIN profile' },
        { status: data.statusCode },
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar ADMIN profile: ', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
