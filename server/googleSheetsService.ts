/**
 * Google Sheets Service
 * Envia dados para uma planilha Google Sheets usando a API pública
 */

interface SheetData {
  promoter: string;
  visitDate: string;
  network: string;
  store: string;
  leaderName?: string;
  leaderPhone?: string;
  productsInFreezer: string;
  freezerProducts?: string;
  freezerOrganization: string;
  freezerProblems?: string;
  productsToasted: string;
  toastedProducts?: string;
  visualQuality: string;
  exposure: string;
  exposureProblems?: string;
  generalObservations?: string;
  mainProblem?: string;
  stockDetails?: string;
  counterDetails?: string;
  actionTaken?: string;
  feedback?: string;
}

/**
 * Envia dados para Google Sheets usando a API de formulários
 * A planilha precisa ter um formulário vinculado para receber os dados
 */
export async function sendToGoogleSheets(
  spreadsheetId: string,
  data: SheetData
): Promise<boolean> {
  try {
    // Construir a URL do formulário Google Sheets
    // Este método usa a API pública de formulários do Google
    const formUrl = `https://docs.google.com/forms/u/0/d/${spreadsheetId}/formResponse`;

    // Mapear os dados para os campos do formulário
    const params = new URLSearchParams();
    
    // Você precisa descobrir os entry IDs do seu formulário
    // Por enquanto, vamos usar placeholders que você pode customizar
    params.append('entry.123456789', data.promoter); // Promotora
    params.append('entry.987654321', data.visitDate); // Data
    params.append('entry.111111111', data.network); // Rede
    params.append('entry.222222222', data.store); // Loja
    params.append('entry.333333333', data.leaderName || ''); // Líder
    params.append('entry.444444444', data.leaderPhone || ''); // Telefone
    params.append('entry.555555555', data.productsInFreezer); // Produtos na câmara
    params.append('entry.666666666', data.freezerProducts || ''); // Quais produtos
    params.append('entry.777777777', data.freezerOrganization); // Organização
    params.append('entry.888888888', data.freezerProblems || ''); // Problemas
    params.append('entry.999999999', data.productsToasted); // Produtos assados
    params.append('entry.101010101', data.toastedProducts || ''); // Quais assados
    params.append('entry.121212121', data.visualQuality); // Qualidade visual
    params.append('entry.131313131', data.exposure); // Exposição
    params.append('entry.141414141', data.exposureProblems || ''); // Problemas exposição
    params.append('entry.151515151', data.generalObservations || ''); // Observações gerais

    // Fazer a requisição para o Google Forms
    const response = await fetch(formUrl, {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Google Forms retorna 200 mesmo se houver erro, então apenas verificamos se a requisição foi feita
    return response.ok || response.status === 200;
  } catch (error) {
    console.error('[Google Sheets] Erro ao enviar dados:', error);
    return false;
  }
}
