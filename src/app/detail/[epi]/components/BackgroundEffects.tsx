export const BackgroundEffects = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
    <div className="absolute top-3/4 left-1/2 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
  </div>
);
