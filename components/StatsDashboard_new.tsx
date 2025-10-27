"use client";

import { Airdrop } from "@/lib/storage";

interface StatsDashboardProps {
  airdrops: Airdrop[];
}

export default function StatsDashboard({ airdrops }: StatsDashboardProps) {
  const total = airdrops.length;
  const checkedIn = airdrops.filter(a => a.checkedIn).length;
  const completionRate = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

  const overdue = airdrops.filter(a => a.dueDate && new Date(a.dueDate) < new Date() && !a.checkedIn).length;
  const dueSoon = airdrops.filter(a => {
    if (!a.dueDate || a.checkedIn) return false;
    const daysUntilDue = Math.ceil((new Date(a.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue >= 0 && daysUntilDue <= 7;
  }).length;

  const categoryStats = airdrops.reduce((acc, airdrop) => {
    acc[airdrop.category] = (acc[airdrop.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityStats = airdrops.reduce((acc, airdrop) => {
    acc[airdrop.priority] = (acc[airdrop.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const averageProgress = total > 0 ? Math.round(airdrops.reduce((sum, a) => sum + a.progress, 0) / total) : 0;

  return (
    <div className="cosmic-card rounded-xl p-6 mb-6 nebula-element">
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 cosmic-text">
          🌌 Dashboard
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Airdrops</div>
          </div>
          <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{checkedIn}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </div>
          <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{completionRate}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</div>
          </div>
          <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{averageProgress}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Progress</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Alerts */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
              ⚠️ Alerts
            </h3>
            <div className="space-y-3">
              {overdue > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <span className="font-bold text-red-700 dark:text-red-300">{overdue}</span> <span className="text-red-600 dark:text-red-400">airdrops overdue</span>
                </div>
              )}
              {dueSoon > 0 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                  <span className="font-bold text-orange-700 dark:text-orange-300">{dueSoon}</span> <span className="text-orange-600 dark:text-orange-400">due within 7 days</span>
                </div>
              )}
              {overdue === 0 && dueSoon === 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <span className="font-bold text-green-700 dark:text-green-300">All airdrops are on track! 🎉</span>
                </div>
              )}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
              📂 Categories
            </h3>
            <div className="space-y-2">
              {Object.entries(categoryStats).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">{category}</span>
                  <span className="font-bold bg-white dark:bg-gray-600 px-2 py-1 rounded-full text-sm text-gray-900 dark:text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
            🎯 Priority Levels
          </h3>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
              <span className="text-gray-700 dark:text-gray-300">High: <span className="font-bold">{priorityStats.High || 0}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
              <span className="text-gray-700 dark:text-gray-300">Medium: <span className="font-bold">{priorityStats.Medium || 0}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
              <span className="text-gray-700 dark:text-gray-300">Low: <span className="font-bold">{priorityStats.Low || 0}</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
