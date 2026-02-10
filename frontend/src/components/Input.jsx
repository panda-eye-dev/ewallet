export default function Input({ className = "", ...props }) {
  return (
    <input
      className={
        "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 " +
        className
      }
      {...props}
    />
  );
}
