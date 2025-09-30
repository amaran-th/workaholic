import { PrismaClient } from "@prisma/client";

// NodeJS global 객체 확장
declare global {
  var prisma: PrismaClient | undefined;
}

// 이미 prisma가 있으면 재사용, 없으면 새로 생성
export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // 필요 시 로깅
  });

// 개발 환경에서는 글로벌에 저장
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
