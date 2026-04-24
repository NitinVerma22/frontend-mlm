"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Wallet, TrendingUp, Users, Network, ArrowDownLeft, ArrowUpRight, Copy, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

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
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!userId) return; // ProtectedRoute will handle missing token



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
        console.error("Failed to fetch data:", err);
        setError(err?.response?.data?.message || 'Failed to connect to the backend API');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="animate-pulse flex items-center space-x-2">
          <Wallet className="w-5 h-5 text-gray-400" />
          <span className="text-gray-500 font-medium">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-100 font-medium shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FAFAFA] p-6 sm:p-10 text-gray-900 font-sans">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
            <p className="text-gray-500 mt-1">Welcome back. Here is your latest MLM wallet activity.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Wallet Balance" value={`${data.walletBalance} Coins`} icon={Wallet} color="text-blue-600" />
            <StatCard title="Total Earnings" value={`${data.totalEarnings} Coins`} icon={TrendingUp} color="text-emerald-600" />
            <StatCard title="Direct Referrals" value={data.directReferrals} icon={Users} color="text-indigo-600" />
            <StatCard title="Team Size (7 Levels)" value={data.totalTeamSize} icon={Network} color="text-purple-600" />
          </div>

          {/* Referral Section */}
          <ReferralCard code={data.referralCode} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Level-wise Income */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-1">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Network className="w-5 h-5 text-gray-400" />
                Level Income
              </h2>
              <div className="space-y-4">
                {data.levelWiseIncome.map((level) => (
                  <div key={level.level} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-gray-600 font-medium">Level {level.level}</span>
                    <span className="font-semibold text-gray-900">{level.amount.toFixed(2)} Coins</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
              <h2 className="text-xl font-semibold mb-6">Recent Transactions</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500 text-sm">
                      <th className="pb-3 font-medium">Type</th>
                      <th className="pb-3 font-medium">Source</th>
                      <th className="pb-3 font-medium text-right">Amount</th>
                      <th className="pb-3 font-medium text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {data.transactions.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-8 text-gray-500">No transactions found</td></tr>
                    ) : (
                      data.transactions.map((tx) => (
                        <tr key={tx._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              {tx.type === 'CREDIT' ? (
                                <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <ArrowUpRight className="w-4 h-4 text-red-500" />
                              )}
                              <span className="font-medium">{tx.type}</span>
                            </div>
                          </td>
                          <td className="py-4 text-gray-600">
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 border border-gray-100 text-xs font-medium">
                              {tx.source}
                            </span>
                          </td>
                          <td className={`py-4 text-right font-semibold ${tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-gray-900'}`}>
                            {tx.type === 'CREDIT' ? '+' : '-'}{tx.amount}
                          </td>
                          <td className="py-4 text-right text-gray-500 font-mono text-xs">
                            {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-xl bg-gray-50 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}

function ReferralCard({ code }: { code: string }) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const link = `http://localhost:3000/signup?ref=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!code) return null;

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-indigo-100 shadow-sm bg-gradient-to-r from-indigo-50/50 to-white flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-1">Invite Friends & Earn</h2>
        <p className="text-gray-500 text-sm max-w-sm">Share your referral link to build your team and start earning up to 7 levels deep.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2.5 rounded-xl font-mono font-bold text-indigo-700 tracking-wider">
          {code}
        </div>

        <div className="flex items-center gap-2 w-full shrink-0">
          <button
            onClick={handleCopyCode}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            {copiedCode ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copiedCode ? 'Copied!' : 'Copy Code'}
          </button>

          <button
            onClick={handleCopyLink}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            {copiedLink ? <CheckCircle2 className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
            {copiedLink ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
