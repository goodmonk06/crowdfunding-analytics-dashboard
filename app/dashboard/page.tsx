"use client";

import { Card } from "@/components/Card";
import { ChartWrapper } from "@/components/ChartWrapper";
import { Campaign } from "@/lib/types";
import { calculateAnalytics, formatCurrency, formatNumber, formatPercentage } from "@/lib/utils";
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
import campaignData from "@/data/sample-campaign.json";

export default function DashboardPage() {
  const campaign = campaignData as Campaign;
  const analytics = calculateAnalytics(campaign);

  return (
    <div className="py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          プラットフォーム: {campaign.platform} | 期間: {campaign.startDate} 〜 {campaign.endDate}
        </p>
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
          value={formatPercentage(analytics.goalProgress)}
          subtitle={`残り${analytics.daysRemaining}日`}
        />
      </div>

      {/* チャート */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWrapper title="日別支援額推移">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={campaign.dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalAmount"
                stroke="#8884d8"
                name="日別支援額"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <ChartWrapper title="累積支援額推移">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={campaign.dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
              />
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

        <ChartWrapper title="累積支援者数推移">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={campaign.dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="cumulativeBackers"
                stroke="#ff7300"
                name="累積支援者数"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>
    </div>
  );
}
