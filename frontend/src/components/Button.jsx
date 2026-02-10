export default function Button({ className = "", ...props }) {
  return (
    <button
      className={
        "px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.99] transition " +
        className
      }
      {...props}
    />
  );
}