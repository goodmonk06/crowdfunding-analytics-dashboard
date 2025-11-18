import { z } from "zod";

// Campaign validation schemas
export const createCampaignSchema = z.object({
  title: z.string().min(1, "タイトルは必須です").max(200),
  goalAmount: z.number().int().positive("目標金額は正の整数である必要があります"),
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()),
  platform: z.string().min(1, "プラットフォームは必須です"),
  description: z.string().optional(),
});

export const updateCampaignSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  goalAmount: z.number().int().positive().optional(),
  startDate: z.string().datetime().or(z.date()).optional(),
  endDate: z.string().datetime().or(z.date()).optional(),
  platform: z.string().min(1).optional(),
  description: z.string().optional(),
});

// Reward validation schemas
export const createRewardSchema = z.object({
  name: z.string().min(1, "リターン名は必須です").max(100),
  price: z.number().int().nonnegative("価格は0以上である必要があります"),
  description: z.string().optional(),
  campaignId: z.string().cuid(),
});

// Backer validation schemas
export const createBackerSchema = z.object({
  amount: z.number().int().positive("支援額は正の整数である必要があります"),
  backedAt: z.string().datetime().or(z.date()),
  rewardId: z.string().cuid(),
  rewardName: z.string().min(1),
  campaignId: z.string().cuid(),
});

// Daily stats validation schemas
export const createDailyStatsSchema = z.object({
  date: z.string().datetime().or(z.date()),
  backers: z.number().int().nonnegative(),
  totalAmount: z.number().int().nonnegative(),
  cumulativeAmount: z.number().int().nonnegative(),
  cumulativeBackers: z.number().int().nonnegative(),
  campaignId: z.string().cuid(),
});

// Type exports
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
export type CreateRewardInput = z.infer<typeof createRewardSchema>;
export type CreateBackerInput = z.infer<typeof createBackerSchema>;
export type CreateDailyStatsInput = z.infer<typeof createDailyStatsSchema>;
