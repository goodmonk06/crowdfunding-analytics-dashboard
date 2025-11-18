import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateCampaignSchema } from "@/lib/validations";
import { handleApiError, successResponse, ApiError } from "@/lib/api-response";

// GET /api/campaigns/[id] - Get a specific campaign
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
      include: {
        backers: {
          orderBy: { backedAt: "desc" },
        },
        rewards: {
          orderBy: { price: "asc" },
        },
        dailyStats: {
          orderBy: { date: "asc" },
        },
      },
    });

    if (!campaign) {
      throw new ApiError(404, "キャンペーンが見つかりません", "NOT_FOUND");
    }

    return successResponse(campaign);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/campaigns/[id] - Update a campaign
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updateCampaignSchema.parse(body);

    // Check if campaign exists
    const existing = await prisma.campaign.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      throw new ApiError(404, "キャンペーンが見つかりません", "NOT_FOUND");
    }

    const campaign = await prisma.campaign.update({
      where: { id: params.id },
      data: {
        ...(validated.title && { title: validated.title }),
        ...(validated.goalAmount && { goalAmount: validated.goalAmount }),
        ...(validated.startDate && { startDate: new Date(validated.startDate) }),
        ...(validated.endDate && { endDate: new Date(validated.endDate) }),
        ...(validated.platform && { platform: validated.platform }),
        ...(validated.description !== undefined && { description: validated.description }),
      },
      include: {
        backers: true,
        rewards: true,
        dailyStats: true,
      },
    });

    return successResponse(campaign);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/campaigns/[id] - Delete a campaign
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existing = await prisma.campaign.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      throw new ApiError(404, "キャンペーンが見つかりません", "NOT_FOUND");
    }

    await prisma.campaign.delete({
      where: { id: params.id },
    });

    return successResponse({ message: "キャンペーンを削除しました" });
  } catch (error) {
    return handleApiError(error);
  }
}
