import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createBackerSchema } from "@/lib/validations";
import { handleApiError, successResponse } from "@/lib/api-response";

// POST /api/backers - Create a new backer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createBackerSchema.parse(body);

    const backer = await prisma.backer.create({
      data: {
        amount: validated.amount,
        backedAt: new Date(validated.backedAt),
        rewardId: validated.rewardId,
        rewardName: validated.rewardName,
        campaignId: validated.campaignId,
      },
    });

    // Update reward backer count
    await prisma.reward.update({
      where: { id: validated.rewardId },
      data: {
        backerCount: {
          increment: 1,
        },
      },
    });

    return successResponse(backer, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
