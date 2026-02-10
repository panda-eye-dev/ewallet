import client from "./client";

export async function getWallet() {
  const { data } = await client.get("/wallet/");
  return data; // {balance}
}

export async function topUp(amount) {
  const { data } = await client.post("/wallet/top-up", { amount });
  return data;
}
