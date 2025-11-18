import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.dailyStats.deleteMany()
  await prisma.backer.deleteMany()
  await prisma.reward.deleteMany()
  await prisma.campaign.deleteMany()

  // Create campaigns
  const campaign1 = await prisma.campaign.create({
    data: {
      title: '革新的なスマートウォッチ開発プロジェクト',
      goalAmount: 5000000,
      startDate: new Date('2025-10-01'),
      endDate: new Date('2025-12-31'),
      platform: 'Makuake',
      description: '最新技術を搭載したスマートウォッチの開発プロジェクトです。',
    },
  })

  const campaign2 = await prisma.campaign.create({
    data: {
      title: 'エコフレンドリーな水筒プロジェクト',
      goalAmount: 2000000,
      startDate: new Date('2025-09-15'),
      endDate: new Date('2025-11-30'),
      platform: 'Campfire',
      description: '環境に優しい素材を使用した水筒の製作プロジェクトです。',
    },
  })

  const campaign3 = await prisma.campaign.create({
    data: {
      title: '次世代ノートPCスタンド',
      goalAmount: 3000000,
      startDate: new Date('2025-08-01'),
      endDate: new Date('2025-10-31'),
      platform: 'Readyfor',
      description: '人間工学に基づいた設計のノートPCスタンドです。',
    },
  })

  console.log('✅ Created campaigns')

  // Create rewards for campaign1
  const reward1 = await prisma.reward.create({
    data: {
      name: '早割 30% OFF',
      price: 14000,
      description: '先着100名様限定の早割価格',
      backerCount: 0,
      campaignId: campaign1.id,
    },
  })

  const reward2 = await prisma.reward.create({
    data: {
      name: '通常価格',
      price: 20000,
      description: '通常価格でのご支援',
      backerCount: 0,
      campaignId: campaign1.id,
    },
  })

  const reward3 = await prisma.reward.create({
    data: {
      name: 'プレミアムセット',
      price: 35000,
      description: '本体+専用バンド3本セット',
      backerCount: 0,
      campaignId: campaign1.id,
    },
  })

  const reward4 = await prisma.reward.create({
    data: {
      name: '応援プラン',
      price: 5000,
      description: 'リターン不要の応援プラン',
      backerCount: 0,
      campaignId: campaign1.id,
    },
  })

  // Create rewards for campaign2
  const reward5 = await prisma.reward.create({
    data: {
      name: 'ベーシックボトル',
      price: 3000,
      description: '標準サイズのエコボトル',
      backerCount: 0,
      campaignId: campaign2.id,
    },
  })

  const reward6 = await prisma.reward.create({
    data: {
      name: 'プレミアムボトル',
      price: 5000,
      description: '大容量のプレミアムボトル',
      backerCount: 0,
      campaignId: campaign2.id,
    },
  })

  // Create rewards for campaign3
  const reward7 = await prisma.reward.create({
    data: {
      name: 'スタンダードスタンド',
      price: 8000,
      description: '基本モデル',
      backerCount: 0,
      campaignId: campaign3.id,
    },
  })

  const reward8 = await prisma.reward.create({
    data: {
      name: 'デラックススタンド',
      price: 12000,
      description: '高機能モデル',
      backerCount: 0,
      campaignId: campaign3.id,
    },
  })

  console.log('✅ Created rewards')

  // Create backers for campaign1
  const backerData1 = [
    { amount: 14000, date: new Date('2025-10-01T10:00:00Z'), rewardId: reward1.id, rewardName: reward1.name },
    { amount: 14000, date: new Date('2025-10-01T11:30:00Z'), rewardId: reward1.id, rewardName: reward1.name },
    { amount: 20000, date: new Date('2025-10-01T14:20:00Z'), rewardId: reward2.id, rewardName: reward2.name },
    { amount: 14000, date: new Date('2025-10-02T09:15:00Z'), rewardId: reward1.id, rewardName: reward1.name },
    { amount: 35000, date: new Date('2025-10-02T16:45:00Z'), rewardId: reward3.id, rewardName: reward3.name },
    { amount: 20000, date: new Date('2025-10-03T08:30:00Z'), rewardId: reward2.id, rewardName: reward2.name },
    { amount: 14000, date: new Date('2025-10-03T12:00:00Z'), rewardId: reward1.id, rewardName: reward1.name },
    { amount: 5000, date: new Date('2025-10-03T15:20:00Z'), rewardId: reward4.id, rewardName: reward4.name },
    { amount: 14000, date: new Date('2025-10-04T10:10:00Z'), rewardId: reward1.id, rewardName: reward1.name },
    { amount: 20000, date: new Date('2025-10-04T13:45:00Z'), rewardId: reward2.id, rewardName: reward2.name },
    { amount: 35000, date: new Date('2025-10-05T11:00:00Z'), rewardId: reward3.id, rewardName: reward3.name },
    { amount: 14000, date: new Date('2025-10-05T14:30:00Z'), rewardId: reward1.id, rewardName: reward1.name },
    { amount: 20000, date: new Date('2025-10-06T09:00:00Z'), rewardId: reward2.id, rewardName: reward2.name },
    { amount: 14000, date: new Date('2025-10-06T12:20:00Z'), rewardId: reward1.id, rewardName: reward1.name },
    { amount: 5000, date: new Date('2025-10-06T16:00:00Z'), rewardId: reward4.id, rewardName: reward4.name },
    { amount: 20000, date: new Date('2025-10-07T10:30:00Z'), rewardId: reward2.id, rewardName: reward2.name },
    { amount: 14000, date: new Date('2025-10-07T14:15:00Z'), rewardId: reward1.id, rewardName: reward1.name },
    { amount: 35000, date: new Date('2025-10-08T11:45:00Z'), rewardId: reward3.id, rewardName: reward3.name },
    { amount: 20000, date: new Date('2025-10-08T15:30:00Z'), rewardId: reward2.id, rewardName: reward2.name },
    { amount: 14000, date: new Date('2025-10-09T09:20:00Z'), rewardId: reward1.id, rewardName: reward1.name },
    { amount: 20000, date: new Date('2025-10-09T13:00:00Z'), rewardId: reward2.id, rewardName: reward2.name },
    { amount: 5000, date: new Date('2025-10-10T10:00:00Z'), rewardId: reward4.id, rewardName: reward4.name },
    { amount: 14000, date: new Date('2025-10-10T14:30:00Z'), rewardId: reward1.id, rewardName: reward1.name },
    { amount: 20000, date: new Date('2025-10-11T11:15:00Z'), rewardId: reward2.id, rewardName: reward2.name },
    { amount: 35000, date: new Date('2025-10-11T15:00:00Z'), rewardId: reward3.id, rewardName: reward3.name },
  ]

  for (const backer of backerData1) {
    await prisma.backer.create({
      data: {
        amount: backer.amount,
        backedAt: backer.date,
        rewardId: backer.rewardId,
        rewardName: backer.rewardName,
        campaignId: campaign1.id,
      },
    })

    await prisma.reward.update({
      where: { id: backer.rewardId },
      data: { backerCount: { increment: 1 } },
    })
  }

  // Create backers for campaign2
  const backerData2 = [
    { amount: 3000, date: new Date('2025-09-16T10:00:00Z'), rewardId: reward5.id, rewardName: reward5.name },
    { amount: 5000, date: new Date('2025-09-16T14:00:00Z'), rewardId: reward6.id, rewardName: reward6.name },
    { amount: 3000, date: new Date('2025-09-17T11:00:00Z'), rewardId: reward5.id, rewardName: reward5.name },
    { amount: 3000, date: new Date('2025-09-18T09:00:00Z'), rewardId: reward5.id, rewardName: reward5.name },
    { amount: 5000, date: new Date('2025-09-18T15:00:00Z'), rewardId: reward6.id, rewardName: reward6.name },
  ]

  for (const backer of backerData2) {
    await prisma.backer.create({
      data: {
        amount: backer.amount,
        backedAt: backer.date,
        rewardId: backer.rewardId,
        rewardName: backer.rewardName,
        campaignId: campaign2.id,
      },
    })

    await prisma.reward.update({
      where: { id: backer.rewardId },
      data: { backerCount: { increment: 1 } },
    })
  }

  console.log('✅ Created backers')

  // Create daily stats for campaign1
  const dailyStatsData1 = [
    { date: new Date('2025-10-01'), backers: 3, totalAmount: 48000, cumulativeAmount: 48000, cumulativeBackers: 3 },
    { date: new Date('2025-10-02'), backers: 2, totalAmount: 49000, cumulativeAmount: 97000, cumulativeBackers: 5 },
    { date: new Date('2025-10-03'), backers: 3, totalAmount: 39000, cumulativeAmount: 136000, cumulativeBackers: 8 },
    { date: new Date('2025-10-04'), backers: 2, totalAmount: 34000, cumulativeAmount: 170000, cumulativeBackers: 10 },
    { date: new Date('2025-10-05'), backers: 2, totalAmount: 49000, cumulativeAmount: 219000, cumulativeBackers: 12 },
    { date: new Date('2025-10-06'), backers: 3, totalAmount: 39000, cumulativeAmount: 258000, cumulativeBackers: 15 },
    { date: new Date('2025-10-07'), backers: 2, totalAmount: 34000, cumulativeAmount: 292000, cumulativeBackers: 17 },
    { date: new Date('2025-10-08'), backers: 2, totalAmount: 55000, cumulativeAmount: 347000, cumulativeBackers: 19 },
    { date: new Date('2025-10-09'), backers: 2, totalAmount: 34000, cumulativeAmount: 381000, cumulativeBackers: 21 },
    { date: new Date('2025-10-10'), backers: 2, totalAmount: 19000, cumulativeAmount: 400000, cumulativeBackers: 23 },
    { date: new Date('2025-10-11'), backers: 2, totalAmount: 55000, cumulativeAmount: 455000, cumulativeBackers: 25 },
  ]

  for (const stats of dailyStatsData1) {
    await prisma.dailyStats.create({
      data: {
        date: stats.date,
        backers: stats.backers,
        totalAmount: stats.totalAmount,
        cumulativeAmount: stats.cumulativeAmount,
        cumulativeBackers: stats.cumulativeBackers,
        campaignId: campaign1.id,
      },
    })
  }

  // Create daily stats for campaign2
  const dailyStatsData2 = [
    { date: new Date('2025-09-16'), backers: 2, totalAmount: 8000, cumulativeAmount: 8000, cumulativeBackers: 2 },
    { date: new Date('2025-09-17'), backers: 1, totalAmount: 3000, cumulativeAmount: 11000, cumulativeBackers: 3 },
    { date: new Date('2025-09-18'), backers: 2, totalAmount: 8000, cumulativeAmount: 19000, cumulativeBackers: 5 },
  ]

  for (const stats of dailyStatsData2) {
    await prisma.dailyStats.create({
      data: {
        date: stats.date,
        backers: stats.backers,
        totalAmount: stats.totalAmount,
        cumulativeAmount: stats.cumulativeAmount,
        cumulativeBackers: stats.cumulativeBackers,
        campaignId: campaign2.id,
      },
    })
  }

  console.log('✅ Created daily stats')

  console.log('✅ Seeding completed successfully!')
  console.log(`
Created:
  - ${await prisma.campaign.count()} campaigns
  - ${await prisma.reward.count()} rewards
  - ${await prisma.backer.count()} backers
  - ${await prisma.dailyStats.count()} daily stats records
  `)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
