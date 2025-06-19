import { Satellite } from "lucide-react";

export const PageHeader = () => (
  <div className="text-center space-y-4">
    <div className="flex items-center justify-center gap-3 mb-4">
      <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-xl border border-purple-400/30">
        <Satellite className="w-8 h-8 text-purple-300" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-200 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
        Network Locator
      </h1>
    </div>
    <p className="text-purple-200/80 text-lg max-w-2xl mx-auto leading-relaxed">
      Find the nearest network point locations based on your coordinates
    </p>
  </div>
);
