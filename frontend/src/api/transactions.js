import client from "./client";

export async function fetchTransactions() {
  const { data } = await client.get("/transactions/");
  return data;
}
