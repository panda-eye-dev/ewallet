import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { register as apiRegister } from "../api/auth";

export default function Register() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("parent");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await apiRegister({ name, email, password, role });
      nav("/login");
    } catch (err) {
      setError(err?.response?.data?.detail || "Register failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-xl font-semibold">Create your account</h1>
        <p className="text-sm text-slate-600 mt-1">Start assigning tasks & rewards.</p>

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <div>
            <label className="text-sm">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Role</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="parent">Parent</option>
              <option value="child">Child</option>
            </select>
          </div>
          <div>
            <label className="text-sm">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
          <Button className="w-full">Register</Button>
        </form>

        <p className="text-sm text-slate-600 mt-4">
          Already have an account? <Link className="text-slate-900 underline" to="/login">Login</Link>
        </p>
      </Card>
    </div>
  );
}
