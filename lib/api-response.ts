import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleApiError(error: unknown) {
  console.error("API Error:", error);

  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "入力データが無効です",
          code: "VALIDATION_ERROR",
          details: error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        },
      },
      { status: 400 }
    );
  }

  // Custom API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code || "API_ERROR",
        },
      },
      { status: error.statusCode }
    );
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "既に存在するデータです",
            code: "DUPLICATE_ERROR",
          },
        },
        { status: 409 }
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "データが見つかりません",
            code: "NOT_FOUND",
          },
        },
        { status: 404 }
      );
    }
  }

  // Generic errors
  return NextResponse.json(
    {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "予期しないエラーが発生しました",
        code: "INTERNAL_ERROR",
      },
    },
    { status: 500 }
  );
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}
