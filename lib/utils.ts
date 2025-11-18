import { Campaign, AnalyticsData, CohortData, RewardAnalytics } from "./types";
import { differenceInDays, parseISO, format, startOfWeek } from "date-fns";

/**
 * キャンペーンデータから分析データを計算する
 */
export function calculateAnalytics(campaign: Campaign): AnalyticsData {
  const totalAmount = campaign.backers.reduce((sum, backer) => sum + backer.amount, 0);
  const totalBackers = campaign.backers.length;
  const averageAmount = totalBackers > 0 ? totalAmount / totalBackers : 0;
  const goalProgress = (totalAmount / campaign.goalAmount) * 100;
  const daysRemaining = differenceInDays(
    new Date(campaign.endDate),
    new Date()
  );

  return {
    totalAmount,
    totalBackers,
    averageAmount,
    goalProgress,
    daysRemaining: Math.max(0, daysRemaining),
  };
}

/**
 * リターン別の分析データを計算する
 */
export function calculateRewardAnalytics(campaign: Campaign): RewardAnalytics[] {
  const totalAmount = campaign.backers.reduce((sum, backer) => sum + backer.amount, 0);

  const rewardMap = new Map<string, { backers: number; totalAmount: number; rewardName: string }>();

  campaign.backers.forEach((backer) => {
    const existing = rewardMap.get(backer.rewardId) || {
      backers: 0,
      totalAmount: 0,
      rewardName: backer.rewardName,
    };
    existing.backers += 1;
    existing.totalAmount += backer.amount;
    rewardMap.set(backer.rewardId, existing);
  });

  return Array.from(rewardMap.entries()).map(([rewardId, data]) => ({
    rewardId,
    rewardName: data.rewardName,
    backers: data.backers,
    totalAmount: data.totalAmount,
    percentage: totalAmount > 0 ? (data.totalAmount / totalAmount) * 100 : 0,
  })).sort((a, b) => b.totalAmount - a.totalAmount);
}

/**
 * 週別のコホート分析データを計算する
 */
export function calculateCohortData(campaign: Campaign): CohortData[] {
  const cohortMap = new Map<string, { backers: number; totalAmount: number }>();
  const startDate = parseISO(campaign.startDate);

  campaign.backers.forEach((backer) => {
    const backedDate = parseISO(backer.backedAt);
    const weekStart = startOfWeek(backedDate, { weekStartsOn: 1 });
    const weekNumber = Math.floor(differenceInDays(weekStart, startDate) / 7) + 1;
    const period = `Week ${weekNumber}`;

    const existing = cohortMap.get(period) || { backers: 0, totalAmount: 0 };
    existing.backers += 1;
    existing.totalAmount += backer.amount;
    cohortMap.set(period, existing);
  });

  return Array.from(cohortMap.entries())
    .map(([period, data]) => ({
      period,
      backers: data.backers,
      totalAmount: data.totalAmount,
      averageAmount: data.backers > 0 ? data.totalAmount / data.backers : 0,
    }))
    .sort((a, b) => {
      const weekA = parseInt(a.period.split(" ")[1]);
      const weekB = parseInt(b.period.split(" ")[1]);
      return weekA - weekB;
    });
}

/**
 * 金額をフォーマットする
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  }).format(amount);
}

/**
 * 数値をフォーマットする
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("ja-JP").format(num);
}

/**
 * パーセンテージをフォーマットする
 */
export function formatPercentage(percentage: number): string {
  return `${percentage.toFixed(1)}%`;
}
