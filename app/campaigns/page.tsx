"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface Campaign {
  id: string;
  title: string;
  goalAmount: number;
  startDate: string;
  endDate: string;
  platform: string;
  backers: any[];
  createdAt: string;
}

interface PaginatedResponse {
  campaigns: Campaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function CampaignsPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCampaigns();
  }, [page]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/campaigns?page=${page}&limit=10`);
      if (!response.ok) throw new Error("Failed to fetch campaigns");
      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このキャンペーンを削除しますか？")) return;

    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete campaign");
      fetchCampaigns();
    } catch (err) {
      alert("削除に失敗しました");
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

  if (error) {
    return (
      <div className="py-8">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">キャンペーン管理</h1>
        <Link
          href="/campaigns/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          新規作成
        </Link>
      </div>

      {data && data.campaigns.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            キャンペーンがありません
          </p>
          <Link
            href="/campaigns/new"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            最初のキャンペーンを作成する →
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    タイトル
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    プラットフォーム
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    目標金額
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    支援者数
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {data?.campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                      >
                        {campaign.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {campaign.platform}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                      {formatCurrency(campaign.goalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                      {formatNumber(campaign.backers?.length || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(campaign.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data && data.pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                前へ
              </button>
              <span className="px-4 py-2">
                {page} / {data.pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === data.pagination.totalPages}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                次へ
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
