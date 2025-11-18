"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      goalAmount: parseInt(formData.get("goalAmount") as string),
      startDate: new Date(formData.get("startDate") as string).toISOString(),
      endDate: new Date(formData.get("endDate") as string).toISOString(),
      platform: formData.get("platform") as string,
      description: formData.get("description") as string,
    };

    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "作成に失敗しました");
      }

      const result = await response.json();
      router.push(`/campaigns/${result.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">新規キャンペーン作成</h1>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="platform" className="block text-sm font-medium mb-2">
            プラットフォーム <span className="text-red-500">*</span>
          </label>
          <select
            id="platform"
            name="platform"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
          >
            <option value="">選択してください</option>
            <option value="Makuake">Makuake</option>
            <option value="Campfire">Campfire</option>
            <option value="Kickstarter">Kickstarter</option>
            <option value="Readyfor">Readyfor</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="goalAmount" className="block text-sm font-medium mb-2">
            目標金額（円） <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="goalAmount"
            name="goalAmount"
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium mb-2">
              開始日 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium mb-2">
              終了日 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            説明
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "作成中..." : "作成"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
