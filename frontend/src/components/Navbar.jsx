import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Button from "./Button";

const Item = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      "px-3 py-2 rounded-lg text-sm " +
      (isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100")
    }
  >
    {children}
  </NavLink>
);

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="font-semibold tracking-tight">
          EarnIt <span className="text-slate-500 font-normal">• tasks → rewards</span>
        </Link>

        <div className="flex items-center gap-2">
          <Item to="/dashboard">Dashboard</Item>
          <Item to="/tasks">Tasks</Item>
          <Item to="/wallet">Wallet</Item>
          <Item to="/transactions">Transactions</Item>
          {user?.role === "parent" && <Item to="/children">Children</Item>}
          <Button className="ml-2" onClick={logout}>Logout</Button>
        </div>
      </div>
    </div>
  );
}
