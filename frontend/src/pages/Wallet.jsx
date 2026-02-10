import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../auth/AuthContext";
import { getWallet, topUp } from "../api/wallet";
import client from "../api/client"; // ✅ use axios client

export default function Wallet() {

  const { user } = useAuth();

  const [balance, setBalance] = useState(null);
  const [converted, setConverted] = useState(null);
  const [currency, setCurrency] = useState("USD");

  const [amount, setAmount] = useState(100);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // ✅ Load wallet balance
  async function loadWallet() {
    try {
      const w = await getWallet();
      setBalance(w.balance);
    } catch (e) {
      console.error("Failed loading wallet", e);
    }
  }

  // ✅ Load currency conversion (NO direct fetch)
  async function loadConversion(selectedCurrency = currency) {
    try {
      const res = await client.get(
        `/wallet/convert?currency=${selectedCurrency}`
      );

      setConverted(res.data.converted_balance);

    } catch (e) {
      console.error("Conversion failed", e);
    }
  }

  // Initial load
  useEffect(() => {
    loadWallet();
    loadConversion();
  }, []);

  // ✅ Top-up handler
  async function onTopup() {

    setMsg("");
    setErr("");

    try {

      const data = await topUp(Number(amount));

      setMsg(data.message);
      setBalance(data.balance);

      // refresh conversion after topup
      loadConversion();

    } catch (e) {

      setErr(e?.response?.data?.detail || "Top-up failed");

    }
  }

  return (

    <Layout>

      <div className="grid md:grid-cols-2 gap-4">

        {/* Balance Card */}
        <Card className="p-6">

          <div className="text-sm text-slate-600">Current balance</div>

          <div className="text-3xl font-semibold mt-1">
            ₹{balance ?? "--"}
          </div>

          {/* Currency Selector */}
          <select
            value={currency}
            onChange={(e) => {
              const newCurrency = e.target.value;
              setCurrency(newCurrency);
              loadConversion(newCurrency);
            }}
            className="mt-4 border border-slate-300 rounded-lg px-3 py-2"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="AED">AED</option>
            <option value="JPY">JPY</option>
          </select>

          <div className="text-lg text-slate-700 mt-2">
            Equivalent: {converted ? `${currency} ${converted}` : "--"}
          </div>

          <p className="text-sm text-slate-600 mt-2">
            Only Parent can top up
          </p>

        </Card>

        {/* Top-up Card */}
        <Card className="p-6">

          <div className="font-semibold">Top-up</div>

          <p className="text-sm text-slate-600 mt-1">
            Only parents can top up.
          </p>

          <div className="mt-4 flex gap-2">

            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <Button
              disabled={user?.role !== "parent"}
              onClick={onTopup}
            >
              Top-up
            </Button>

          </div>

          {msg && <div className="text-sm text-green-700 mt-3">{msg}</div>}
          {err && <div className="text-sm text-red-600 mt-3">{err}</div>}

        </Card>

      </div>

    </Layout>

  );
}
