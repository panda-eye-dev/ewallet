import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Top Navigation */}
      <Navbar />

      {/* Centered Content Container */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

    </div>
  );
}
