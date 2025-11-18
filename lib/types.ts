// クラウドファンディングキャンペーンの型定義

export interface Backer {
  id: string;
  amount: number;
  backedAt: string; // ISO 8601 形式
  rewardId: string;
  rewardName: string;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  backers: number;
  totalAmount: number;
  cumulativeAmount: number;
  cumulativeBackers: number;
}

export interface Reward {
  id: string;
  name: string;
  price: number;
  description: string;
  backerCount: number;
}

export interface Campaign {
  id: string;
  title: string;
  goalAmount: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  platform: string;
  backers: Backer[];
  rewards: Reward[];
  dailyStats: DailyStats[];
}

// 集計データの型定義
export interface AnalyticsData {
  totalAmount: number;
  totalBackers: number;
  averageAmount: number;
  goalProgress: number; // パーセンテージ
  daysRemaining: number;
}

// コホート分析用の型定義
export interface CohortData {
  period: string; // "Week 1", "Week 2", etc.
  backers: number;
  totalAmount: number;
  averageAmount: number;
}

export interface RewardAnalytics {
  rewardId: string;
  rewardName: string;
  backers: number;
  totalAmount: number;
  percentage: number; // 全体に占める割合
}
