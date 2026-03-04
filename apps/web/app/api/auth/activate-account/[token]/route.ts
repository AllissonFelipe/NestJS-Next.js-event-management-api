import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;

  try {
    const response = await fetch(
      `${process.env.API_URL}/auth/activate-account/${token}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });

  } catch (error) {
    console.error("API Route Error:", error)
    const message = error instanceof Error ? error.message : "Erro interno no servidor.";
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}
