const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const BASE_URL = rawBaseUrl.replace(/\/$/, '');
const GRAPHQL_ENDPOINT = `${BASE_URL}/graphql`;

export async function validateQrToken(token: string) {
  const query = `
    mutation RedirectQrCode($input: ValidateQrCodeInputDto!) {
      RedirectQrCode(input: $input) {
        environmentId
        environmentName 
        description
        type
        locationName
        startDate
        endDate
        status
        # mapConfig
      }
    }
  `;

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { input: { token } }
      }),
    });

    if (!response.ok) throw new Error("Erro de conexão com o servidor.");

    const result = await response.json();

    if (result.errors) {
      console.error("Erro Validação QR:", result.errors);
      throw new Error(result.errors[0].message || "QR Code inválido.");
    }

    // Retorna o objeto que contém o environmentId
    return result.data.RedirectQrCode;

  } catch (error: any) {
    throw error;
  }
}