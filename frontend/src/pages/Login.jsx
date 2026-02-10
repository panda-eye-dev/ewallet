import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleHint, setRoleHint] = useState("parent");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password, roleHint);
      nav("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.detail || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-red-200">

    <Card className="w-full max-w-md p-8">

        <h1 className="text-xl font-semibold">Welcome back</h1>
        <p className="text-sm text-slate-600 mt-1">Login to manage tasks and rewards.</p>

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <div>
            <label className="text-sm text-slate-700">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="parent@email.com" />
          </div>

          <div>
            <label className="text-sm text-slate-700">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div>
            <label className="text-sm text-slate-700">I am logging in as</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
              value={roleHint}
              onChange={(e) => setRoleHint(e.target.value)}
            >
              <option value="parent">Parent</option>
              <option value="child">Child</option>
            </select>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <Button className="w-full">Login</Button>
        </form>

        <p className="text-sm text-slate-600 mt-4">
          New here? <Link className="text-slate-900 underline" to="/register">Create an account</Link>
        </p>
      </Card>
    </div>
  );
}
