import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

type RouteParams = {
  params: Promise<{ id: string; action: string }>;
};

export async function PATCH(req: Request, context: RouteParams) {
  try {
    const { id, action } = await context.params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/subscriptions/plans/${id}/${action}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken?.value}`,
          'Content-Type': 'application/json',
        },
      },
    );
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
