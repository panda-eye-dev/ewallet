import axios from "axios";

const client = axios.create({
  baseURL: "https://promises-tires-periodically-wisdom.trycloudflare.com",

});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
