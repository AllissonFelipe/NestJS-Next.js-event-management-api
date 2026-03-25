import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/subscriptions/plans`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken?.value}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || 'Erro ao buscar planos' },
        { status: data.statusCode },
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar planos: ', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { name, description, price, durationInDays, isActive } = await req.json();

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/subscriptions/plans`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken?.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        price,
        durationInDays,
        isActive,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || `Erro ao criar plano.` },
        { status: data.statusCode || res.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.log(`Erro POST plan: `, error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
