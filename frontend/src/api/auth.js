import client from "./client";

export async function login(email, password) {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);

  const { data } = await client.post("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data; // {access_token, token_type}
}

export async function register(payload) {
  const { data } = await client.post("/auth/register", payload);
  return data;
}

export async function createChild(payload) {
  const { data } = await client.post("/auth/children", payload);
  return data;
}
