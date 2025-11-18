"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { ChartWrapper } from "@/components/ChartWrapper";
import { formatCurrency, formatNumber, calculateAnalytics } from "@/lib/utils";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Campaign {
  id: string;
  title: string;
  goalAmount: number;
  startDate: string;
  endDate: string;
  platform: string;
  description?: string;
  backers: any[];
  rewards: any[];
  dailyStats: any[];
}

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaign();
  }, [params.id]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/campaigns/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch campaign");
      const result = await response.json();
      setCampaign(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-lg">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="py-8">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error || "キャンペーンが見つかりません"}</p>
          <button
            onClick={() => router.push("/campaigns")}
            className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  const analytics = calculateAnalytics(campaign);

  return (
    <div className="py-8">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            プラットフォーム: {campaign.platform} | 期間: {campaign.startDate.split("T")[0]} 〜{" "}
            {campaign.endDate.split("T")[0]}
          </p>
          {campaign.description && (
            <p className="mt-4 text-gray-700 dark:text-gray-300">{campaign.description}</p>
          )}
        </div>
        <button
          onClick={() => router.push("/campaigns")}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          一覧に戻る
        </button>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          title="総支援額"
          value={formatCurrency(analytics.totalAmount)}
          subtitle={`目標: ${formatCurrency(campaign.goalAmount)}`}
        />
        <Card
          title="支援者数"
          value={formatNumber(analytics.totalBackers)}
          subtitle="総支援者数"
        />
        <Card
          title="平均支援額"
          value={formatCurrency(Math.round(analytics.averageAmount))}
          subtitle="1人あたり"
        />
        <Card
          title="達成率"
          value={`${analytics.goalProgress.toFixed(1)}%`}
          subtitle={`残り${analytics.daysRemaining}日`}
        />
      </div>

      {/* チャート */}
      {campaign.dailyStats.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartWrapper title="累積支援額推移">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={campaign.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cumulativeAmount"
                  stroke="#82ca9d"
                  name="累積支援額"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>

          <ChartWrapper title="日別支援者数">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaign.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="backers" fill="#8884d8" name="支援者数" />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>
      )}

      {/* リターン一覧 */}
      {campaign.rewards.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">リターン一覧</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    リターン名
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    価格
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    支援者数
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {campaign.rewards.map((reward) => (
                  <tr key={reward.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {reward.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-500 dark:text-gray-400">
                      {formatCurrency(reward.price)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-500 dark:text-gray-400">
                      {formatNumber(reward.backerCount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
