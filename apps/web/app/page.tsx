"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

type ViewType = "login" | "register" | "events" | "create";

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [view, setView] = useState<ViewType>("login");
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  // 🔹 Carrega token do localStorage no cliente
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setView("events");
    }
  }, []);

  // 🔹 Sempre que token mudar, buscar eventos
  useEffect(() => {
    if (token) {
      fetchEvents();
    }
  }, [token]);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao buscar eventos");

      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error(error);
    }
  };

  const login = async () => {
    try {
      const res = await fetch(`${API_URL}/person/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        setToken(data.accessToken);
        setView("events");
      }
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  const register = async () => {
    try {
      await fetch(`${API_URL}/person`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      setView("login");
    } catch (error) {
      console.error("Erro no registro:", error);
    }
  };

  const createEvent = async () => {
    try {
      await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventForm),
      });

      setEventForm({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
      });

      fetchEvents();
      setView("events");
    } catch (error) {
      console.error("Erro ao criar evento:", error);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await fetch(`${API_URL}/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchEvents();
    } catch (error) {
      console.error("Erro ao deletar evento:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setEvents([]);
    setView("login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          Sistema de Eventos
        </motion.h1>

        {/* LOGIN */}
        {view === "login" && (
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-6 space-y-4">
              <Input
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
              <Input
                placeholder="Senha"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
              <div className="flex gap-2">
                <Button onClick={login}>Entrar</Button>
                <Button
                  variant="outline"
                  onClick={() => setView("register")}
                >
                  Criar Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* REGISTER */}
        {view === "register" && (
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-6 space-y-4">
              <Input
                placeholder="Nome"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
              <Input
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
              <Input
                placeholder="Senha"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
              <div className="flex gap-2">
                <Button onClick={register}>Registrar</Button>
                <Button
                  variant="outline"
                  onClick={() => setView("login")}
                >
                  Voltar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* EVENTS */}
        {view === "events" && (
          <div className="space-y-6">
            <div className="flex justify-between">
              <Button onClick={() => setView("create")}>
                Novo Evento
              </Button>
              <Button variant="outline" onClick={logout}>
                Sair
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="rounded-2xl shadow-md"
                >
                  <CardContent className="p-4 space-y-2">
                    <h2 className="text-xl font-semibold">
                      {event.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {event.description}
                    </p>
                    <p className="text-xs">
                      {event.startDate} - {event.endDate}
                    </p>
                    <Button
                      variant="destructive"
                      onClick={() => deleteEvent(event.id)}
                    >
                      Excluir
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CREATE EVENT */}
        {view === "create" && (
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-6 space-y-4">
              <Input
                placeholder="Título"
                value={eventForm.title}
                onChange={(e) =>
                  setEventForm({
                    ...eventForm,
                    title: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Descrição"
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm({
                    ...eventForm,
                    description: e.target.value,
                  })
                }
              />
              <Input
                type="datetime-local"
                value={eventForm.startDate}
                onChange={(e) =>
                  setEventForm({
                    ...eventForm,
                    startDate: e.target.value,
                  })
                }
              />
              <Input
                type="datetime-local"
                value={eventForm.endDate}
                onChange={(e) =>
                  setEventForm({
                    ...eventForm,
                    endDate: e.target.value,
                  })
                }
              />
              <div className="flex gap-2">
                <Button onClick={createEvent}>Salvar</Button>
                <Button
                  variant="outline"
                  onClick={() => setView("events")}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
