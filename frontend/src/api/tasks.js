import client from "./client";

export async function fetchTasks() {
  const { data } = await client.get("/tasks");
  return data;
}

export async function createTask(payload) {
  const { data } = await client.post("/tasks/create", payload);
  return data;
}

export async function updateTask(taskId, payload) {
  const { data } = await client.put(`/tasks/${taskId}`, payload);
  return data;
}

export async function completeTask(taskId) {
  const { data } = await client.patch(`/tasks/${taskId}/complete`);
  return data;
}

export async function approveTask(taskId) {
  const { data } = await client.patch(`/tasks/${taskId}/approve`);
  return data;
}

export async function deleteTask(taskId) {
  const { data } = await client.delete(`/tasks/${taskId}`);
  return data;
}

