import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Badge from "../components/Badge";
import { fetchTransactions } from "../api/transactions";

export default function Transactions() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr("");
      try {
        const data = await fetchTransactions();
        setItems(Array.isArray(data) ? data : (data.transactions || []));
      } catch (e) {
        setErr(e?.response?.data?.detail || "Failed to load transactions");
      }
    })();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-semibold">Transactions</h1>
      <p className="text-sm text-slate-600 mt-1">Latest wallet activity.</p>

      {err && <div className="mt-4 text-sm text-red-600">{err}</div>}

      <div className="mt-5 grid gap-3">
        {items.map((t, idx) => (
          <Card key={idx} className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge>{t.txn_type}</Badge>
              <div className="font-medium">₹{t.amount}</div>
            </div>
            <div className="text-sm text-slate-600">{String(t.created_at || "")}</div>
          </Card>
        ))}

        {items.length === 0 && (
          <Card className="p-8 text-center text-slate-600">No transactions yet.</Card>
        )}
      </div>
    </Layout>
  );
}
