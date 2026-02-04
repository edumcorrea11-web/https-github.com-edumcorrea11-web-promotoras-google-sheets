import { notifyOwner } from "./_core/notification";
import type { Report } from "../drizzle/schema";

/**
 * Generate a formatted summary of the report for email notification
 */
export function generateReportSummary(report: Report): string {
  const lines = [
    `📋 Novo Relatório de Visita Bridor`,
    ``,
    `Promotora: ${report.promoter}`,
    `Data: ${report.visitDate}`,
    `Rede: ${report.network}`,
    `Loja: ${report.store}`,
    ...(report.leaderName ? [`Líder: ${report.leaderName}`] : []),
    ...(report.leaderPhone ? [`Telefone: ${report.leaderPhone}`] : []),
    ``,
    `Tipo: ${report.reportType === 'simple' ? 'Visita Normal' : 'Alerta Crítico'}`,
    ``,
    `Horário: ${new Date(report.createdAt).toLocaleString('pt-BR')}`,
  ];

  return lines.join('\n');
}

/**
 * Send report notification to owner via Manus Notification Service
 * This will be delivered to the owner's configured email addresses
 */
export async function sendReportNotification(report: Report): Promise<boolean> {
  try {
    const summary = generateReportSummary(report);
    
    const success = await notifyOwner({
      title: `Novo Relatório: ${report.promoter} - ${report.store}`,
      content: summary,
    });

    if (success) {
      console.log(`[Email] Report notification sent for report ID: ${report.id}`);
    } else {
      console.warn(`[Email] Failed to send report notification for report ID: ${report.id}`);
    }

    return success;
  } catch (error) {
    console.error(`[Email] Error sending report notification:`, error);
    return false;
  }
}
