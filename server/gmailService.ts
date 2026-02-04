import nodemailer from 'nodemailer';
import type { Report } from '../drizzle/schema';

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Generate HTML email body for report
 */
function generateEmailHTML(report: Report): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0066cc;">📋 Novo Relatório de Visita Bridor</h2>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Promotora:</strong> ${report.promoter}</p>
            <p><strong>Data:</strong> ${report.visitDate}</p>
            <p><strong>Rede:</strong> ${report.network}</p>
            <p><strong>Loja:</strong> ${report.store}</p>
            ${report.leaderName ? `<p><strong>Líder:</strong> ${report.leaderName}</p>` : ''}
            ${report.leaderPhone ? `<p><strong>Telefone:</strong> ${report.leaderPhone}</p>` : ''}
            <p><strong>Tipo:</strong> ${report.reportType === 'simple' ? 'Visita Normal' : 'Alerta Crítico'}</p>
            <p><strong>Horário:</strong> ${new Date(report.createdAt).toLocaleString('pt-BR')}</p>
          </div>

          <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <p style="margin: 0;"><strong>Observação:</strong> Este é um relatório automático do sistema Bridor. Verifique o formulário para detalhes completos.</p>
          </div>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            Este email foi enviado automaticamente pelo sistema de gestão de visitas Bridor.
          </p>
        </div>
      </body>
    </html>
  `;
}

/**
 * Send report via Gmail
 */
export async function sendReportEmail(report: Report, recipientEmail: string): Promise<boolean> {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn('[Gmail] Credenciais do Gmail não configuradas');
      return false;
    }

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: recipientEmail,
      subject: `Novo Relatório Bridor: ${report.promoter} - ${report.store}`,
      html: generateEmailHTML(report),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Gmail] Email enviado com sucesso. ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('[Gmail] Erro ao enviar email:', error);
    return false;
  }
}
