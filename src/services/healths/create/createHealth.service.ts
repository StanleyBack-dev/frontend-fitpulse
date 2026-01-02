import axios from "axios";

interface CreateHealthInput {
  heightCm: number;
  weightKg: number;
  observation?: string;
  measurementDate: string;
}

interface CreateHealthResponse {
  idHealth: string;
  bmi: number;
  status: string;
  createdAt: string;
}

export async function createHealth(input: CreateHealthInput) {
  const query = `
    mutation CreateHealth($input: CreateHealthInputDto!) {
      createHealth(input: $input) {
        idHealth
        bmi
        status
        createdAt
      }
    }
  `;

  const variables = { input };

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
    { query, variables },
    { withCredentials: true }
  );

  if (response.data.errors) {
    throw new Error(response.data.errors[0].message);
  }

  return response.data.data.createHealth as CreateHealthResponse;
}