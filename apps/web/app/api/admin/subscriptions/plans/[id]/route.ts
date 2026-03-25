import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(req: Request, context: RouteParams) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/subscriptions/plans/${id}`, {
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
    console.log(`Erro GET plan: `, error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: RouteParams) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    const { name, description, price, durationInDays } = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/subscriptions/plans/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken?.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        price,
        durationInDays,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || `Erro ao atualizar plano.` },
        { status: data.statusCode || res.status },
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.log(`Erro PATCH plan: `, error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: RouteParams) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/subscriptions/plans/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken?.value}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      let data = null;
      try {
        data = await res.json();
      } catch {}

      return NextResponse.json(
        { error: data?.message || 'Erro ao deletar plano.' },
        { status: res.status },
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(`Erro DELETE plan: `, error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
