import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRewardSchema } from "@/lib/validations";
import { handleApiError, successResponse } from "@/lib/api-response";

// POST /api/rewards - Create a new reward
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createRewardSchema.parse(body);

    const reward = await prisma.reward.create({
      data: {
        name: validated.name,
        price: validated.price,
        description: validated.description,
        campaignId: validated.campaignId,
      },
    });

    return successResponse(reward, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
