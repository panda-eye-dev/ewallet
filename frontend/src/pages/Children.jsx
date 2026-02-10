import { useState } from "react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { createChild } from "../api/auth";
import { useAuth } from "../auth/AuthContext";

export default function Children() {
  const { user } = useAuth();
  const [child_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function onCreate(e) {
    e.preventDefault();
    setMsg(""); setErr("");

    if (user?.role !== "parent") {
      setErr("Only parents can create child accounts.");
      return;
    }

    try {
      const data = await createChild({ child_name, email, password });
      setMsg(`${data.message}. Child ID: ${data["Child id"]}`);
    } catch (e2) {
      setErr(e2?.response?.data?.detail || "Create child failed");
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold">Children</h1>
        <p className="text-sm text-slate-600 mt-1">Create a child account (linked to you).</p>

        <Card className="p-6 mt-4">
          <form onSubmit={onCreate} className="space-y-3">
            <div>
              <label className="text-sm">Child name</label>
              <Input value={child_name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Child email</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Temporary password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <Button>Create child</Button>

            {msg && <div className="text-sm text-green-700">{msg}</div>}
            {err && <div className="text-sm text-red-600">{err}</div>}
          </form>
        </Card>
      </div>
    </Layout>
  );
}
