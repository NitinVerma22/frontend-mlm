"use client";

import { useState } from 'react';
import axios from 'axios';
import { Pickaxe, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleGetCoin = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        window.location.href = '/login';
        return;
      }

      const res = await axios.post(
        'http://localhost:5000/api/wallet/get-coin',
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ text: `Success! Added 100 Coins. Current balance: ${res.data.walletBalance}.`, type: 'success' });
    } catch (err: any) {
      console.error('API error:', err);
      setMessage({ text: err?.response?.data?.message || 'Failed to claim coins. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-gray-900 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center relative overflow-hidden">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Pickaxe className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-2">Claim Tokens</h1>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          Complete your daily task to earn 100 Coins instantly into your wallet.
        </p>

        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-left animate-in fade-in slide-in-from-bottom-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <button
          onClick={handleGetCoin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 py-4 px-6 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>Get 100 Coins <Pickaxe className="w-4 h-4 ml-1" /></>
          )}
        </button>

        <div className="mt-6 pt-6 border-t border-gray-50 text-sm text-gray-500">
          Want to see your total balance? <Link href="/dashboard" className="text-blue-600 font-semibold hover:underline">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
