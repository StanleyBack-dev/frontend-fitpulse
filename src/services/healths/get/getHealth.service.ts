import axios from "axios";

export async function getHealth(query: string, variables?: any) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
    { query, variables },
    { withCredentials: true }
  );

  if (response.data.errors) throw new Error(response.data.errors[0].message);
  return response.data.data;
}