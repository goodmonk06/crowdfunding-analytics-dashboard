import { describe, it, expect } from 'vitest'
import {
  calculateAnalytics,
  calculateRewardAnalytics,
  calculateCohortData,
  formatCurrency,
  formatNumber,
  formatPercentage,
} from '@/lib/utils'
import type { Campaign } from '@/lib/types'

describe('Utils', () => {
  const mockCampaign: Campaign = {
    id: 'test-1',
    title: 'Test Campaign',
    goalAmount: 1000000,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    platform: 'Makuake',
    backers: [
      {
        id: 'b1',
        amount: 10000,
        backedAt: '2025-01-05T10:00:00Z',
        rewardId: 'r1',
        rewardName: 'Early Bird',
      },
      {
        id: 'b2',
        amount: 20000,
        backedAt: '2025-01-10T10:00:00Z',
        rewardId: 'r2',
        rewardName: 'Standard',
      },
      {
        id: 'b3',
        amount: 15000,
        backedAt: '2025-01-15T10:00:00Z',
        rewardId: 'r1',
        rewardName: 'Early Bird',
      },
    ],
    rewards: [
      {
        id: 'r1',
        name: 'Early Bird',
        price: 10000,
        description: 'Early bird special',
        backerCount: 2,
      },
      {
        id: 'r2',
        name: 'Standard',
        price: 20000,
        description: 'Standard reward',
        backerCount: 1,
      },
    ],
    dailyStats: [
      {
        date: '2025-01-05',
        backers: 1,
        totalAmount: 10000,
        cumulativeAmount: 10000,
        cumulativeBackers: 1,
      },
      {
        date: '2025-01-10',
        backers: 1,
        totalAmount: 20000,
        cumulativeAmount: 30000,
        cumulativeBackers: 2,
      },
    ],
  }

  describe('calculateAnalytics', () => {
    it('should calculate correct analytics', () => {
      const analytics = calculateAnalytics(mockCampaign)

      expect(analytics.totalAmount).toBe(45000)
      expect(analytics.totalBackers).toBe(3)
      expect(analytics.averageAmount).toBe(15000)
      expect(analytics.goalProgress).toBe(4.5)
      expect(analytics.daysRemaining).toBeGreaterThanOrEqual(0)
    })

    it('should handle empty backers array', () => {
      const emptyCampaign = { ...mockCampaign, backers: [] }
      const analytics = calculateAnalytics(emptyCampaign)

      expect(analytics.totalAmount).toBe(0)
      expect(analytics.totalBackers).toBe(0)
      expect(analytics.averageAmount).toBe(0)
    })
  })

  describe('calculateRewardAnalytics', () => {
    it('should calculate reward analytics correctly', () => {
      const rewardAnalytics = calculateRewardAnalytics(mockCampaign)

      expect(rewardAnalytics).toHaveLength(2)
      expect(rewardAnalytics[0].rewardName).toBe('Early Bird')
      expect(rewardAnalytics[0].backers).toBe(2)
      expect(rewardAnalytics[0].totalAmount).toBe(25000)
      expect(rewardAnalytics[0].percentage).toBeCloseTo(55.56, 1)
    })

    it('should sort by totalAmount descending', () => {
      const rewardAnalytics = calculateRewardAnalytics(mockCampaign)

      expect(rewardAnalytics[0].totalAmount).toBeGreaterThanOrEqual(
        rewardAnalytics[1].totalAmount
      )
    })
  })

  describe('calculateCohortData', () => {
    it('should calculate weekly cohorts', () => {
      const cohortData = calculateCohortData(mockCampaign)

      expect(cohortData.length).toBeGreaterThan(0)
      expect(cohortData[0]).toHaveProperty('period')
      expect(cohortData[0]).toHaveProperty('backers')
      expect(cohortData[0]).toHaveProperty('totalAmount')
      expect(cohortData[0]).toHaveProperty('averageAmount')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1000)).toBe('¥1,000')
      expect(formatCurrency(1000000)).toBe('¥1,000,000')
    })
  })

  describe('formatNumber', () => {
    it('should format numbers correctly', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1000000)).toBe('1,000,000')
    })
  })

  describe('formatPercentage', () => {
    it('should format percentages correctly', () => {
      expect(formatPercentage(45.678)).toBe('45.7%')
      expect(formatPercentage(100)).toBe('100.0%')
    })
  })
})
