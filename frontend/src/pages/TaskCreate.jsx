import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { createTask } from "../api/tasks";
import { useAuth } from "../auth/AuthContext";

export default function TaskCreate() {
  const { user } = useAuth();
  const nav = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward_amount, setReward] = useState(50);
  const [child_id, setChildId] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (user?.role !== "parent") {
      setError("Only parents can create tasks.");
      return;
    }

    try {
      await createTask({
        title,
        description,
        reward_amount: Number(reward_amount),
        child_id: Number(child_id),
      });
      nav("/tasks");
    } catch (e2) {
      setError(e2?.response?.data?.detail || "Create task failed");
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold">Create Task</h1>
        <p className="text-sm text-slate-600 mt-1">Assign a task to a child (by Child ID).</p>

        <Card className="p-6 mt-4">
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="text-sm">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Description</label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm">Reward Amount</label>
                <Input type="number" value={reward_amount} onChange={(e) => setReward(e.target.value)} />
              </div>
              <div>
                <label className="text-sm">Child ID</label>
                <Input value={child_id} onChange={(e) => setChildId(e.target.value)} placeholder="e.g. 3" />
              </div>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}
            <Button>Create</Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
