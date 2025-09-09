'use client'
import { FormEvent, useState } from "react";
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Github, Mail } from "lucide-react"

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState<"login" | "register">("login");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const url = mode === "login"
      ? "http://localhost:5000/auth/login"
      : "http://localhost:5000/auth/register";

    const body = mode === "login"
      ? { email, password }
      : { email, senha: password }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Erro ao processar");

      if (mode === "login") {
        localStorage.setItem("token", data.token);
        console.log("Login bem-sucedido:", data);
      } else {
        alert("Usuário registrado com sucesso!");
        setMode("login");
      }
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Cabeçalho */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">
              Bem vindo ao assistente Financeiro
            </h1>
            <p className="text-muted-foreground text-gray-500">
              {mode === "login"
                ? "Entre com seus dados para acessar sua conta"
                : "Crie sua conta para começar"}
            </p>
          </div>

          {/* Formulário */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="teste@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {mode === "login" && (
                <div className="flex items-center space-x-y">
                  <Checkbox id="remember" className="mr-2 cursor-pointer" />
                  <Label htmlFor="remember" className="cursor-pointer">Lembrar acesso</Label>
                </div>
              )}
              {mode === "login" && (
                <a
                  href="#"
                  className="text-sm text-primary-500 hover:text-primary-600 cursor-pointer"
                >
                  Esqueceu a senha?
                </a>
              )}
            </div>

            <Button type="submit" className="w-full cursor-pointer">
              {mode === "login" ? "Entrar" : "Registrar"}
            </Button>
          </form>

          {/* Separador */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>

          {/* Provedores */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full cursor-pointer">
              <Github className="mr-2 h-4 w-4" />
              Github
            </Button>
            <Button variant="outline" className="w-full cursor-pointer">
              <Mail className="mr-2 h-4 w-4" />
              Gmail
            </Button>
          </div>

          {/* Alternar login/register */}
          <div className="text-center text-sm">
            {mode === "login" ? (
              <>
                Não tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-primary-500 hover:text-primary-600 font-medium cursor-pointer"
                >
                  Criar conta
                </button>
              </>
            ) : (
              <>
                Já tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-primary-500 hover:text-primary-600 font-medium cursor-pointer"
                >
                  Entrar
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
