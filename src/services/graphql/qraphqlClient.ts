import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const GRAPHQL_ENDPOINT = `${API_URL.replace(/\/$/, "")}/graphql`;

export async function graphqlClient<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  try {
    const response = await axios.post(
      GRAPHQL_ENDPOINT,
      { query, variables },
      { withCredentials: true }
    );

    if (response.data.errors) {
      console.error("GraphQL Error:", response.data.errors);
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data as T;
  } catch (error) {
    console.error("Erro no graphqlClient:", error);
    throw error;
  }
}