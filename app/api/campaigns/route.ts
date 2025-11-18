import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCampaignSchema } from "@/lib/validations";
import { handleApiError, successResponse } from "@/lib/api-response";

// GET /api/campaigns - List all campaigns
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get("platform");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where = platform ? { platform } : {};

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        include: {
          backers: true,
          rewards: true,
          dailyStats: {
            orderBy: { date: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.campaign.count({ where }),
    ]);

    return successResponse({
      campaigns,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/campaigns - Create a new campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createCampaignSchema.parse(body);

    const campaign = await prisma.campaign.create({
      data: {
        title: validated.title,
        goalAmount: validated.goalAmount,
        startDate: new Date(validated.startDate),
        endDate: new Date(validated.endDate),
        platform: validated.platform,
        description: validated.description,
      },
      include: {
        backers: true,
        rewards: true,
        dailyStats: true,
      },
    });

    return successResponse(campaign, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
