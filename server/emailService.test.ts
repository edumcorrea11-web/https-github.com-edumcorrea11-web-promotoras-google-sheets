import { describe, expect, it, vi, beforeEach } from "vitest";
import { generateReportSummary, sendReportNotification } from "./emailService";
import type { Report } from "../drizzle/schema";

// Mock the notification module
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn(async () => true),
}));

const createMockReport = (): Report => ({
  id: 1,
  userId: 1,
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
  freezerProblems: null,
  productsToasted: "yes",
  toastedProducts: "Croissant",
  visualQuality: "good",
  exposure: "ok",
  exposureProblems: null,
  generalObservations: "Tudo ok",
  mainProblem: null,
  stockDetails: null,
  counterDetails: null,
  actionTaken: null,
  feedback: null,
  report: "*VISITA BRIDOR*",
  createdAt: new Date("2025-02-03T10:00:00Z"),
  updatedAt: new Date("2025-02-03T10:00:00Z"),
});

describe("emailService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateReportSummary", () => {
    it("should generate a summary with all report details", () => {
      const report = createMockReport();
      const summary = generateReportSummary(report);

      expect(summary).toContain("Novo Relatório de Visita Bridor");
      expect(summary).toContain("Jocieli");
      expect(summary).toContain("2025-02-03");
      expect(summary).toContain("Pão de Açúcar");
      expect(summary).toContain("Loja 17 Barra da Tijuca");
      expect(summary).toContain("João");
      expect(summary).toContain("Visita Normal");
    });

    it("should handle critical report type", () => {
      const report = createMockReport();
      report.reportType = "critical";
      const summary = generateReportSummary(report);

      expect(summary).toContain("Alerta Crítico");
    });

    it("should handle missing optional fields", () => {
      const report = createMockReport();
      report.leaderName = null;
      report.leaderPhone = null;
      const summary = generateReportSummary(report);

      expect(summary).toContain("Novo Relatório de Visita Bridor");
      expect(summary).not.toContain("Líder:");
      expect(summary).not.toContain("Telefone:");
    });
  });

  describe("sendReportNotification", () => {
    it("should send notification successfully", async () => {
      const report = createMockReport();
      const result = await sendReportNotification(report);

      expect(result).toBe(true);
    });

    it("should handle notification failures gracefully", async () => {
      const { notifyOwner } = await import("./_core/notification");
      vi.mocked(notifyOwner).mockResolvedValueOnce(false);

      const report = createMockReport();
      const result = await sendReportNotification(report);

      expect(result).toBe(false);
    });
  });
});
