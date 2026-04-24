"use client";

import { useState } from "react";
import axios from "axios";
import { SendHorizontal, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function TransferPage() {
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL; // ✅ FIX

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        setMessage({ text: "User not authenticated ❌", type: "error" });
        return;
      }

      const res = await axios.post(
        `${BASE_URL}/api/wallet/transfer`,
        {
          senderId: userId,
          receiverEmail,
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage({
        text: `Transfer successful! Remaining balance: ${res.data.balance}`,
        type: "success",
      });

      setReceiverEmail("");
      setAmount("");
    } catch (err: any) {
      console.error("Transfer Error:", err);

      setMessage({
        text: err?.response?.data?.message || "Transfer Failed ❌",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-64px)] bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-gray-900 font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <SendHorizontal className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Transfer Tokens</h1>
              <p className="text-gray-500 text-sm">Send instantly to any user.</p>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}>
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              {message.text}
            </div>
          )}

          <form onSubmit={handleTransfer} className="space-y-5">
            <input
              type="text"
              placeholder="Recipient Email"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl"
            >
              {loading ? "Sending..." : "Send Tokens"}
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
