const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const BASE_URL = rawBaseUrl.replace(/\/$/, '');
const GRAPHQL_ENDPOINT = `${BASE_URL}/graphql`;

export interface GetEnvironmentInput {
  idEnvironments: string;
}

export async function getEnvironmentById(id: string) {
  const query = `
    query getEnvironment($input: GetEnvironmentInputDto!) {
      getEnvironment(input: $input) {
        idEnvironments
        name
        description
        type
        locationName
        startDate
        endDate
        status
        createdAt
        updatedAt
      }
    }
  `;

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
          input: { idEnvironments: id } 
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar evento: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error("Erro GraphQL (getEnvironment):", result.errors);
      throw new Error(result.errors[0].message || "Erro ao carregar dados do evento.");
    }

    return result.data.getEnvironment;

  } catch (error: any) {
    console.error("Falha no getEnvironment:", error);
    throw error;
  }
}