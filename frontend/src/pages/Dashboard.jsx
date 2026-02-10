import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import { useAuth } from "../auth/AuthContext";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {

  const { token } = useAuth();

  const [data, setData] = useState(null);

  async function loadDashboard() {

    const res = await fetch(
      "https://ewallet-1-wrou.onrender.com/dashboard/summary",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const json = await res.json();

    setData(json);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  // Convert API data → chart format
  const chartData = data
    ? [
        { name: "Pending", value: data.tasks.pending },
        { name: "Completed", value: data.tasks.completed },
        { name: "Approved", value: data.tasks.approved },
      ]
    : [];

  return (
    <Layout>

      {/* SUMMARY CARDS */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <Card className="p-5">
          <div className="text-sm text-slate-500">Total Tasks</div>
          <div className="text-2xl font-semibold">{data?.tasks.total ?? "--"}</div>
        </Card>

        <Card className="p-5">
          <div className="text-sm text-slate-500">Pending</div>
          <div className="text-2xl font-semibold">{data?.tasks.pending ?? "--"}</div>
        </Card>

        <Card className="p-5">
          <div className="text-sm text-slate-500">Approved</div>
          <div className="text-2xl font-semibold">{data?.tasks.approved ?? "--"}</div>
        </Card>

        <Card className="p-5">
          <div className="text-sm text-slate-500">Wallet Balance</div>
          <div className="text-2xl font-semibold">₹{data?.wallet_balance ?? "--"}</div>
        </Card>

        <Card className="p-5">
          <div className="text-sm text-slate-500">Credits</div>
          <div className="text-2xl font-semibold">₹{data?.transactions.credits ?? "--"}</div>
        </Card>

        <Card className="p-5">
          <div className="text-sm text-slate-500">Debits</div>
          <div className="text-2xl font-semibold">₹{data?.transactions.debits ?? "--"}</div>
        </Card>

      </div>

      {/* DATA VISUALIZATION */}
      <Card className="p-6">

        <div className="font-semibold mb-4">
          Task Status Visualization
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>

      </Card>

    </Layout>
  );
}
