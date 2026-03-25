import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

type RouteParams = {
  params: Promise<{ urlFilter: string }>;
};

export async function GET(req: Request, context: RouteParams) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    const { urlFilter } = await context.params;
    const res = await fetch(`${urlFilter}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken?.value}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || 'Erro ao buscar plano.' },
        { status: data.statusCode || res.status },
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.log(`Erro PATCH status plan: `, error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
