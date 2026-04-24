"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Wallet,
  TrendingUp,
  Users,
  Network,
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login again ❌");
          return;
        }

        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const response = await axios.get(
  `${BASE_URL}/api/dashboard/${userId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

        setData(response.data);
      } catch (err: any) {
        console.error("Dashboard Error:", err);
        setError(
          err?.response?.data?.message ||
            "Failed to connect to backend ❌"
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
        Loading...
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
          <StatCard title="Balance" value={data.walletBalance} />
          <StatCard title="Earnings" value={data.totalEarnings} />
          <StatCard title="Direct" value={data.directReferrals} />
          <StatCard title="Team" value={data.totalTeamSize} />
        </div>

        {/* Referral */}
        <ReferralCard code={data.referralCode} />

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

function StatCard({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function ReferralCard({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const link = `${window.location.origin}/signup?ref=${code}`; // ✅ FIXED
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!code) return null;

  return (
    <div className="bg-white p-4 rounded-xl flex justify-between items-center">
      <span>{code}</span>
      <button onClick={handleCopy} className="bg-indigo-600 text-white px-3 py-1 rounded">
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
