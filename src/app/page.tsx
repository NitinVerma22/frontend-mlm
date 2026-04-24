"use client";

import { useState } from "react";
import axios from "axios";
import { Pickaxe, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleGetCoin = async () => {
    setLoading(true);
    setMessage(null);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL; // ✅ FIX

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        window.location.href = "/login";
        return;
      }

      const res = await axios.post(
        `${BASE_URL}/api/wallet/get-coin`, // ✅ FIX
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage({
        text: `Success! Added Coins. Current balance: ${res.data.walletBalance}`,
        type: "success",
      });
    } catch (err: any) {
      console.error("API error:", err);
      setMessage({
        text: err?.response?.data?.message || "Failed to claim coins ❌",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-gray-900 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">

        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Pickaxe className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-bold mb-2">Claim Tokens</h1>
        <p className="text-gray-500 mb-8">
          Complete your daily task to earn coins instantly.
        </p>

        {message && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <button
          onClick={handleGetCoin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-xl"
        >
          {loading ? "Processing..." : "Get Coins"}
        </button>

        <div className="mt-6 text-sm">
          <Link href="/dashboard" className="text-blue-600 font-semibold">
            Go to Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}
