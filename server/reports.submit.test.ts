import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database module
vi.mock("./db", () => ({
  createReport: vi.fn(async (data) => {
    return { insertId: 1 };
  }),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("reports.submit", () => {
  let ctx: TrpcContext;

  beforeEach(() => {
    ctx = createContext();
  });

  it("should submit a simple visit report", async () => {
    const caller = appRouter.createCaller(ctx);

    const reportData = {
      reportType: "simple",
      promoter: "Jocieli",
      visitDate: "2025-02-03",
      network: "Pão de Açúcar",
      store: "Loja 17 Barra da Tijuca",
      leaderName: "João",
      leaderPhone: "(21) 99999-9999",
      productsInFreezer: "yes",
      freezerProducts: "5 cx Croissant",
      freezerOrganization: "ok",
      freezerProblems: "Nenhum",
      productsToasted: "yes",
      toastedProducts: "Croissant",
      visualQuality: "good",
      exposure: "ok",
      exposureProblems: "Nenhum",
      generalObservations: "Tudo ok",
      report: "*VISITA BRIDOR*\n\n**Promotora:** Jocieli",
    };

    const result = await caller.reports.submit(reportData);

    expect(result).toEqual({
      success: true,
      message: "Report submitted successfully",
    });
  });

  it("should submit a critical alert report", async () => {
    const caller = appRouter.createCaller(ctx);

    const reportData = {
      reportType: "critical",
      promoter: "Odara",
      visitDate: "2025-02-03",
      network: "OBA",
      store: "Loja 5 SP",
      mainProblem: "Ruptura desde abril",
      stockDetails: "Sem produtos",
      counterDetails: "Balcão vazio",
      actionTaken: "Avisei o gerente",
      feedback: "Gerente informou problema no CD",
      report: "*ALERTA BRIDOR*\n\n**Promotora:** Odara",
    };

    const result = await caller.reports.submit(reportData);

    expect(result).toEqual({
      success: true,
      message: "Report submitted successfully",
    });
  });

  it("should handle missing optional fields", async () => {
    const caller = appRouter.createCaller(ctx);

    const reportData = {
      reportType: "simple",
      promoter: "Jocieli",
      visitDate: "2025-02-03",
      network: "Pão de Açúcar",
      store: "Loja 17",
      report: "*VISITA BRIDOR*",
    };

    const result = await caller.reports.submit(reportData);

    expect(result).toEqual({
      success: true,
      message: "Report submitted successfully",
    });
  });
});
