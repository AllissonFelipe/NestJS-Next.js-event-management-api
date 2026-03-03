"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  token: string;
}

export default function ActivateAccountForm({ token }: Props) {
  const router = useRouter();

  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  const [message, setMessage] = useState("");

  useEffect(() => {
    async function activate() {
      try {
        const res = await fetch(
          `/api/auth/activate-account/${token}`
        );

        const data = await res.json();
        console.log("STATUS:", res.status);
        console.log("DATA:", data);
        if (!res.ok) {
          setStatus("error");
          setMessage(data.message || "Erro ao ativar conta.");
        } else {
          setStatus("success");
          setMessage(data.message || "Conta ativada com sucesso!");
        }
      } catch (error) {
        setStatus("error");

        const msg =
          error instanceof Error
            ? error.message
            : "Erro de conexão.";

        setMessage(msg);
      }
    }

    activate();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        {status === "loading" && (
          <>
            <h1 className="text-xl font-semibold mb-4">
              Ativando sua conta...
            </h1>
            <p>Aguarde um momento.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-xl font-semibold text-green-600 mb-4">
              ✅ Conta ativada!
            </h1>
            <p className="mb-6 text-black">{message}</p>

            <button
              onClick={() => router.push("/auth/login")}
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Ir para login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-xl font-semibold text-red-600 mb-4">
              ❌ Erro na ativação
            </h1>
            <p className="text-black">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
