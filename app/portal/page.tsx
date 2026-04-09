"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function PortalLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    if (result?.error) {
      setError("Invalid email or password.")
      setLoading(false)
    } else {
      router.push("/portal/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <span className="font-playfair text-2xl text-[#F2EDE4] tracking-tight">IGC</span>
          <p className="text-[#4A4640] text-xs font-mono mt-1 tracking-wider uppercase">
            Client Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            required
            className="w-full bg-[#111110] border border-[#242220] text-[#F2EDE4] placeholder:text-[#4A4640] px-4 py-3 text-sm focus:outline-none focus:border-[#C9922A] transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            className="w-full bg-[#111110] border border-[#242220] text-[#F2EDE4] placeholder:text-[#4A4640] px-4 py-3 text-sm focus:outline-none focus:border-[#C9922A] transition-colors"
          />

          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-[#C9922A] text-[#C9922A] px-4 py-3 text-sm hover:bg-[#1F4D3A] hover:text-[#F2EDE4] hover:border-[#1F4D3A] transition-colors disabled:opacity-40"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  )
}
