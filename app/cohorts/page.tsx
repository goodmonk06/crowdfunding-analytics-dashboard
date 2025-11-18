"use client";

import { ChartWrapper } from "@/components/ChartWrapper";
import { Campaign } from "@/lib/types";
import {
  calculateRewardAnalytics,
  calculateCohortData,
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "@/lib/utils";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import campaignData from "@/data/sample-campaign.json";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function CohortsPage() {
  const campaign = campaignData as Campaign;
  const rewardAnalytics = calculateRewardAnalytics(campaign);
  const cohortData = calculateCohortData(campaign);

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">コホート分析</h1>

      {/* リターン別分析 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">リターン別分析</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartWrapper title="リターン別支援額">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rewardAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rewardName" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Bar dataKey="totalAmount" fill="#8884d8" name="総支援額" />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>

          <ChartWrapper title="リターン別支援者数">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rewardAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rewardName" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="backers" fill="#82ca9d" name="支援者数" />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>

        {/* リターン別詳細テーブル */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  リターン名
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  支援者数
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  総支援額
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  構成比
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {rewardAnalytics.map((reward) => (
                <tr key={reward.rewardId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {reward.rewardName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                    {formatNumber(reward.backers)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                    {formatCurrency(reward.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                    {formatPercentage(reward.percentage)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 支援時期別グルーピング（週別） */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">支援時期別分析（週別）</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartWrapper title="週別支援額">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cohortData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Bar dataKey="totalAmount" fill="#8884d8" name="総支援額" />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>

          <ChartWrapper title="週別平均支援額">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cohortData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Bar dataKey="averageAmount" fill="#82ca9d" name="平均支援額" />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>

        {/* 週別詳細テーブル */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  期間
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  支援者数
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  総支援額
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  平均支援額
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {cohortData.map((cohort) => (
                <tr key={cohort.period}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {cohort.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                    {formatNumber(cohort.backers)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                    {formatCurrency(cohort.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                    {formatCurrency(Math.round(cohort.averageAmount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
