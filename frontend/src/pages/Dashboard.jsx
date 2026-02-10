import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import { useAuth } from "../auth/AuthContext";
import client from "../api/client"; // 👈 axios instance

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

  // ✅ PUT IT HERE — inside the component
  async function loadDashboard() {
    const res = await client.get("/dashboard/summary");
    setData(res.data);
  }

  useEffect(() => {
    if (token) loadDashboard(); // wait for token
  }, [token]);

  // TASK visualization data
  const taskChart = data
    ? [
        { name: "Total", value: data.tasks.total },
        { name: "Pending", value: data.tasks.pending },
        { name: "Approved", value: data.tasks.approved },
      ]
    : [];

  // WALLET visualization data
  const walletChart = data
    ? [
        { name: "Balance", value: data.wallet_balance },
        { name: "Credits", value: data.transactions.credits },
        { name: "Debits", value: data.transactions.debits },
      ]
    : [];

  return (
    <Layout>
      {/* your JSX stays exactly the same */}
    </Layout>
  );
}
