// 1. Defina a URL base (onde seu NestJS roda)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// 2. IMPORTANTE: Adicione o sufixo "/graphql"
// O erro 404 acontecia porque estava faltando essa parte
const GRAPHQL_ENDPOINT = `${BASE_URL}graphql`;

export async function validateQrToken(token: string) {
  // A query precisa bater com o nome da Mutation no seu Resolver: RedirectQrCode
  const query = `
    mutation RedirectQrCode($input: ValidateQrCodeInputDto!) {
      RedirectQrCode(input: $input) {
        environmentId
        environmentName
        mapConfig
      }
    }
  `;

  console.log("Tentando conectar em:", GRAPHQL_ENDPOINT); // Debug para você ver a URL

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { 
          input: { token } // O NestJS espera que o objeto venha dentro de "input"
        }
      }),
    });

    // Verificação de segurança HTTP (Captura o 404 aqui)
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro de conexão (${response.status}): Verifique se a URL do backend está correta.`);
    }

    const result = await response.json();

    // Verificação de erros do GraphQL (ex: Token inválido, expirado)
    if (result.errors) {
      console.error("Erro GraphQL:", result.errors);
      throw new Error(result.errors[0].message || "Erro ao processar QR Code");
    }

    return result.data.RedirectQrCode;

  } catch (error: any) {
    console.error("Falha no fetch:", error);
    throw error; // Repassa o erro para a HomePage mostrar na tela
  }
}