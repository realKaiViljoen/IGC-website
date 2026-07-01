"use client"

import { useState } from "react"
import Image from "next/image"
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
      router.push("/portal/system/overview")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-2.5">
            <Image src="/peak.png" alt="" width={22} height={23} className="h-[22px] w-auto" aria-hidden="true" priority />
            <span className="text-[22px] font-bold tracking-[-0.03em] text-[#FAF8F5] leading-none">IGC</span>
          </div>
          <p className="eyebrow mt-3 text-[#9C9995]">Client Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            required
            className="w-full bg-[#0F1216] border border-[#20242A] text-[#FAF8F5] placeholder:text-[#9C9995] px-4 py-3 text-sm focus:outline-none focus:border-[#C78B28] transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            className="w-full bg-[#0F1216] border border-[#20242A] text-[#FAF8F5] placeholder:text-[#9C9995] px-4 py-3 text-sm focus:outline-none focus:border-[#C78B28] transition-colors"
          />

          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-[#C78B28] text-[#C78B28] px-4 py-3 text-sm hover:bg-[#C78B28] hover:text-[#0A0C0F] transition-colors duration-150 disabled:opacity-40"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  )
}
