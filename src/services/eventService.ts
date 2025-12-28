const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/graphql';

export async function validateQrToken(token: string) {
  const query = `
    mutation RedirectQrCode($input: ValidateQrCodeInputDto!) {
      RedirectQrCode(input: $input) {
        environmentId
        environmentName
        mapConfig
      }
    }
  `;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { input: { token } }
    }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message || "Erro ao validar QR Code");
  }

  return result.data.RedirectQrCode;
}