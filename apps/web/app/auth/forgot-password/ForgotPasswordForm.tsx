"use client";

import { useState } from "react";

export default function ForgotPasswordForm() {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    
    async function handleSubmit(e: React.FormEvent) {
        
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            })
            const data = await res.json();
            if (!res.ok) {
                setError(data.message);
                return;
            }
            setMessage(data.message);
        } catch (err) {
            console.error("Resend activation email error:", err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Erro ao reenviar email de ativação");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 bg-white p-8 rounded-xl shadow-lg w-[350px]"
        >
            <h2 className="text-2xl font-bold text-center text-black">
                Redefinir senha
            </h2>

            <p className="text-sm text-gray-600 text-center">
                Informe seu email para receber um novo link de alteração de senha.
            </p>

            {message && (
                <div className="text-green-600 text-sm whitespace-pre-line">
                    {message}
                </div>
            )}

            <input
                type="email"
                placeholder="Email"
                className="border p-2 rounded text-black"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
            />

            {error && (
            <div className="text-red-500 text-sm whitespace-pre-line">
                {error}
            </div>
            )}

            <button
                type="submit"
                disabled={loading || !email}
                className="bg-black text-white py-2 rounded disabled:opacity-50"
                >
                {loading ? "Enviando link..." : "Enviar link de redefinição"}
            </button>
        </form>
    );
}