"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProtectedRoute from "@/components/ProtectedRoute";

interface DashboardData {
  walletBalance: number;
  referralCode: string;
  totalEarnings: number;
  directReferrals: number;
  totalTeamSize: number;
  levelWiseIncome: { level: number; amount: number }[];
  transactions: any[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          setError("Please login again ❌");
          return;
        }

        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

        const res = await axios.get(
          `${BASE_URL}/api/dashboard/${userId}`, // ✅ FIXED
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(res.data);
      } catch (err: any) {
        console.error("Dashboard Error:", err);
        setError(
          err?.response?.data?.message ||
            "Failed to load dashboard ❌"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FAFAFA] p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Stat title="Wallet" value={data.walletBalance} />
          <Stat title="Earnings" value={data.totalEarnings} />
          <Stat title="Direct Referrals" value={data.directReferrals} />
          <Stat title="Team Size" value={data.totalTeamSize} />
        </div>

        {/* Referral */}
        <ReferralCard code={data.referralCode} />

        {/* Level Income */}
        <div className="bg-white p-4 rounded-xl mt-6">
          <h2 className="font-semibold mb-4">Level Income</h2>
          {data.levelWiseIncome.map((lvl) => (
            <div key={lvl.level} className="flex justify-between py-2 border-b">
              <span>Level {lvl.level}</span>
              <span>{lvl.amount}</span>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div className="bg-white p-4 rounded-xl mt-6">
          <h2 className="font-semibold mb-4">Transactions</h2>

          {data.transactions.length === 0 ? (
            <p>No transactions</p>
          ) : (
            data.transactions.map((tx) => (
              <div key={tx._id} className="flex justify-between py-2 border-b">
                <span>{tx.source}</span>
                <span>
                  {tx.type === "CREDIT" ? "+" : "-"}
                  {tx.amount}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

function Stat({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function ReferralCard({ code }: { code: string }) {
  const handleCopy = () => {
    const link = `${window.location.origin}/signup?ref=${code}`;
    navigator.clipboard.writeText(link);
    alert("Referral link copied!");
  };

  if (!code) return null;

  return (
    <div className="bg-white p-4 rounded-xl mt-6 flex justify-between items-center">
      <span className="font-mono">{code}</span>
      <button
        onClick={handleCopy}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Copy Link
      </button>
    </div>
  );
}
