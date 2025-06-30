"use client";

import { usePermission } from "@/hooks/usePermission";

export default function PermissionGate({
  minLevel = 0,
  children
}: {
  minLevel?: number;
  children: React.ReactNode;
}) {
  const { isLoggedIn, level, name } = usePermission();

  if (!isLoggedIn || level < minLevel) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center space-y-4 text-black">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-gray-700">Sorry, you do not have permission to access this page.</p>
          {isLoggedIn && (
            <p className="text-sm text-gray-500">
              Logged in as <strong>{name}</strong> (Access Level {level})
            </p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
