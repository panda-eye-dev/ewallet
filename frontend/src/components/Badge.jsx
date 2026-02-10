export default function Badge({ children }) {
  return (
    <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700 border border-slate-200">
      {children}
    </span>
  );
}
