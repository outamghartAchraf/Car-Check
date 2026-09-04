export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

        <p className="mt-4 text-sm text-slate-400">
          Loading...
        </p>
      </div>
    </div>
  );
}