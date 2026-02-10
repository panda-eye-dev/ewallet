import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import { useAuth } from "../auth/AuthContext";
import { approveTask, completeTask, deleteTask, fetchTasks } from "../api/tasks";

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (e) {
      setError(e?.response?.data?.detail || "Failed to load tasks");
    }
  }

  useEffect(() => { load(); }, []);

  async function action(fn, id) {
    setBusyId(id);
    setError("");
    try {
      await fn(id);
      await load();
    } catch (e) {
      setError(e?.response?.data?.detail || "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tasks</h1>
          <p className="text-sm text-slate-600 mt-1">Manage tasks based on your role.</p>
        </div>

        {user?.role === "parent" && (
          <Link to="/tasks/new">
            <Button>Create Task</Button>
          </Link>
        )}
      </div>

      {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

      <div className="mt-5 grid gap-3">
        {tasks.map((t) => (
          <Card key={t.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{t.title}</div>
                  <Badge>{t.status}</Badge>
                </div>
                {t.description && <div className="text-sm text-slate-600 mt-1">{t.description}</div>}
                <div className="text-sm text-slate-600 mt-2">Reward: <span className="font-medium text-slate-900">₹{t.reward_amount}</span></div>
              </div>

              <div className="flex gap-2">
                {user?.role === "child" && t.status === "pending" && (
                  <Button disabled={busyId === t.id} onClick={() => action(completeTask, t.id)}>
                    {busyId === t.id ? "..." : "Mark Complete"}
                  </Button>
                )}

                {user?.role === "parent" && t.status === "completed" && (
                  <Button disabled={busyId === t.id} onClick={() => action(approveTask, t.id)}>
                    {busyId === t.id ? "..." : "Approve & Pay"}
                  </Button>
                )}

                {user?.role === "parent" && t.status !== "approved" && (
                  <button
                    className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-sm"
                    disabled={busyId === t.id}
                    onClick={() => action(deleteTask, t.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}

        {tasks.length === 0 && (
          <Card className="p-8 text-center text-slate-600">No tasks yet.</Card>
        )}
      </div>
    </Layout>
  );
}
