import { describe, it, expect } from 'vitest'
import {
  createCampaignSchema,
  updateCampaignSchema,
  createRewardSchema,
  createBackerSchema,
} from '@/lib/validations'

describe('Validations', () => {
  describe('createCampaignSchema', () => {
    it('should validate correct campaign data', () => {
      const validData = {
        title: 'Test Campaign',
        goalAmount: 1000000,
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-12-31T00:00:00Z',
        platform: 'Makuake',
        description: 'Test description',
      }

      const result = createCampaignSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid campaign data', () => {
      const invalidData = {
        title: '',
        goalAmount: -1000,
        startDate: 'invalid-date',
        endDate: '2025-12-31T00:00:00Z',
        platform: '',
      }

      const result = createCampaignSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should require title', () => {
      const dataWithoutTitle = {
        goalAmount: 1000000,
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-12-31T00:00:00Z',
        platform: 'Makuake',
      }

      const result = createCampaignSchema.safeParse(dataWithoutTitle)
      expect(result.success).toBe(false)
    })

    it('should require positive goalAmount', () => {
      const dataWithNegativeGoal = {
        title: 'Test',
        goalAmount: -100,
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-12-31T00:00:00Z',
        platform: 'Makuake',
      }

      const result = createCampaignSchema.safeParse(dataWithNegativeGoal)
      expect(result.success).toBe(false)
    })
  })

  describe('updateCampaignSchema', () => {
    it('should allow partial updates', () => {
      const partialData = {
        title: 'Updated Title',
      }

      const result = updateCampaignSchema.safeParse(partialData)
      expect(result.success).toBe(true)
    })

    it('should validate updated fields', () => {
      const invalidPartialData = {
        title: '',
      }

      const result = updateCampaignSchema.safeParse(invalidPartialData)
      expect(result.success).toBe(false)
    })
  })

  describe('createRewardSchema', () => {
    it('should validate correct reward data', () => {
      const validData = {
        name: 'Early Bird',
        price: 10000,
        description: 'Early bird special',
        campaignId: 'clxxxxxxx',
      }

      const result = createRewardSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should require non-negative price', () => {
      const dataWithNegativePrice = {
        name: 'Test Reward',
        price: -100,
        campaignId: 'clxxxxxxx',
      }

      const result = createRewardSchema.safeParse(dataWithNegativePrice)
      expect(result.success).toBe(false)
    })
  })

  describe('createBackerSchema', () => {
    it('should validate correct backer data', () => {
      const validData = {
        amount: 10000,
        backedAt: '2025-01-01T00:00:00Z',
        rewardId: 'clxxxxxxx',
        rewardName: 'Early Bird',
        campaignId: 'clyyyyyyy',
      }

      const result = createBackerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should require positive amount', () => {
      const dataWithZeroAmount = {
        amount: 0,
        backedAt: '2025-01-01T00:00:00Z',
        rewardId: 'clxxxxxxx',
        rewardName: 'Early Bird',
        campaignId: 'clyyyyyyy',
      }

      const result = createBackerSchema.safeParse(dataWithZeroAmount)
      expect(result.success).toBe(false)
    })
  })
})
