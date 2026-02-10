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

  async function loadDashboard() {
    try {
      const res = await client.get("/dashboard/summary");
      setData(res.data);
    } catch (err) {
      console.error("Dashboard failed", err);
    }
  }

  useEffect(() => {
    if (token) loadDashboard();
  }, [token]);

  if (!data) {
    return (
      <Layout>
        <div className="p-6">Loading dashboard...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>Dashboard loaded successfully</div>
    </Layout>
  );
}
