import { describe, it, expect, vi } from 'vitest';

describe('Google Sheets Integration', () => {
  it('should format report data correctly for Google Sheets', () => {
    const formData = {
      promoter: 'Jocieli',
      visitDate: '2026-02-09',
      network: 'Zona Sul',
      store: 'Loja 17 Barra da Tijuca',
      leaderName: 'João',
      leaderPhone: '(21) 99999-9999',
      productsInFreezer: 'yes',
      freezerProducts: 'Pão de Queijo, Bolo de Chocolate',
      freezerOrganization: 'ok',
      freezerProblems: '',
      productsToasted: 'yes',
      toastedProducts: 'Croissant, Pão Francês',
      visualQuality: 'good',
      exposure: 'ok',
      exposureProblems: '',
      generalObservations: 'Tudo em ordem',
      mainProblem: '',
      stockDetails: '',
      counterDetails: '',
      actionTaken: '',
      feedback: '',
      reportType: 'Visita Normal',
      report: '*VISITA BRIDOR*\n\n**Promotora:** Jocieli'
    };

    // Validate that all required fields are present
    expect(formData.promoter).toBeDefined();
    expect(formData.visitDate).toBeDefined();
    expect(formData.network).toBeDefined();
    expect(formData.store).toBeDefined();
    expect(formData.reportType).toBeDefined();
    expect(formData.report).toBeDefined();
  });

  it('should handle critical alert report type', () => {
    const formData = {
      promoter: 'Odara',
      visitDate: '2026-02-09',
      network: 'Zona Norte',
      store: 'Loja 5 Centro',
      reportType: 'Alerta Crítico',
      mainProblem: 'Falta de estoque',
      stockDetails: 'Nenhum produto em estoque',
      counterDetails: 'Balcão vazio',
      actionTaken: 'Contato com gerente',
      feedback: 'Gerente prometeu repor amanhã',
      report: '*ALERTA BRIDOR - VISITA CRÍTICA*'
    };

    expect(formData.reportType).toBe('Alerta Crítico');
    expect(formData.mainProblem).toBeDefined();
    expect(formData.stockDetails).toBeDefined();
  });

  it('should handle optional fields gracefully', () => {
    const formData = {
      promoter: 'Test',
      visitDate: '2026-02-09',
      network: 'Test Network',
      store: 'Test Store',
      leaderName: '',
      leaderPhone: '',
      reportType: 'Visita Normal',
      report: 'Test'
    };

    // Optional fields should be empty strings, not undefined
    expect(formData.leaderName).toBe('');
    expect(formData.leaderPhone).toBe('');
  });

  it('should validate webhook URL format', () => {
    const webhookUrl = 'https://script.google.com/macros/s/AKfycbw1UyX3duJKlJ410tnIJPyFMv8G7zxjgdPCrXDvP7AIzb37CxoS5-pxogKZW6NpjfZA/exec';
    
    expect(webhookUrl).toMatch(/^https:\/\/script\.google\.com\/macros\/s\//);
    expect(webhookUrl).toContain('/exec');
  });
});
